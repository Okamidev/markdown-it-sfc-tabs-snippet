import { existsSync, readFileSync, statSync } from 'fs';
import { dirname, resolve } from 'path';
import { parse } from 'vue/compiler-sfc';
import type MarkdownIt from 'markdown-it';
import type { PluginWithOptions } from 'markdown-it';

type RuleBlock = Parameters<MarkdownIt['block']['ruler']['before']>[2];

export interface VueSnippetOptions {
    /**
     * Directory the `@` path prefix points to. Defaults to the markdown root deduced from the
     * render environment.
     */
    root?: string;
    /**
     * Name of the container whose tokens wrap the code blocks, `code-group`. A container without a renderer falls back to plain `<div>` wrappers.
     */
    containerName?: string;
}

/**
 * Environment markdown-it renders with. All fields are optional conventions.
 */
interface RenderEnv {
    path?: string;
    realPath?: string;
    relativePath?: string;
    includes?: string[];
}

interface SnippetBlock {
    title: string;
    lang: string;
    content: string;
}

const OPERATOR = '<<<vue';
const RULE = 'vue-snippet';

const normalizeSeparators = (filePath: string): string => filePath.replace(/\\/g, '/');

/**
 * Deduces the markdown root from a page path and its counterpart relative to that root.
 */
const deduceRoot = ({ path, realPath, relativePath }: RenderEnv): string => {
    const pagePath = realPath ?? path;

    if (pagePath && relativePath) {
        const normalizedPage = normalizeSeparators(pagePath);
        const normalizedRelative = normalizeSeparators(relativePath);

        if (normalizedPage.endsWith(normalizedRelative)) {
            return normalizedPage.slice(0, -normalizedRelative.length).replace(/\/$/, '');
        }
    }

    return process.cwd();
};

/**
 * Removes the indentation shared by every non-empty line, `<template>` content being indented
 * inside its tag.
 */
const dedent = (content: string): string => {
    const lines = content.split('\n');
    const indent = lines.reduce((shortest, line) => {
        const indentLength = line.search(/\S/);

        return indentLength === -1 ? shortest : Math.min(indentLength, shortest);
    }, Infinity);

    return indent === Infinity ? content : lines.map((line) => line.slice(indent)).join('\n');
};

/**
 * Splits an SFC into the blocks to display, one per tab.
 */
const sfcBlocks = (source: string): SnippetBlock[] => {
    const { descriptor } = parse(source);
    const blocks: SnippetBlock[] = [];

    if (descriptor.template) {
        blocks.push({ title: 'template', lang: 'vue-html', content: descriptor.template.content });
    }

    if (descriptor.scriptSetup) {
        blocks.push({
            title: 'script setup',
            lang: descriptor.scriptSetup.lang ?? 'js',
            content: descriptor.scriptSetup.content,
        });
    }

    if (descriptor.script) {
        blocks.push({ title: 'script', lang: descriptor.script.lang ?? 'js', content: descriptor.script.content });
    }

    descriptor.styles.forEach((style) => {
        blocks.push({
            title: style.scoped ? 'style scoped' : 'style',
            lang: style.lang ?? 'css',
            content: style.content,
        });
    });

    descriptor.customBlocks.forEach((block) => {
        blocks.push({ title: block.type, lang: block.lang ?? 'txt', content: block.content });
    });

    return blocks.map((block) => ({ ...block, content: dedent(block.content.replace(/^\n+|\n+$/g, '')) }));
};

/**
 * Adds a `<<<vue path/to/File.vue` operator to markdown files, importing the SFC as a group of
 * code blocks, one per block it declares (`<template>`, `<script>`, `<style>`, custom blocks).
 *
 * Paths are resolved relative to the markdown file, a leading `@` pointing to the markdown root.
 */
const vueSnippet: PluginWithOptions<VueSnippetOptions> = (md, options = {}) => {
    const containerName = options.containerName ?? 'code-group';

    const parser: RuleBlock = (state, startLine, _endLine, silent) => {
        // markdown-it fills one entry per line of `src`, so `startLine` always indexes a number.
        const pos = state.bMarks[startLine]! + state.tShift[startLine]!;
        const max = state.eMarks[startLine]!;

        if (state.sCount[startLine]! - state.blkIndent >= 4) return false;
        if (state.src.slice(pos, pos + OPERATOR.length) !== OPERATOR) return false;
        if (silent) return true;

        state.line = startLine + 1;

        const pushFence = (info: string, content: string) => {
            const token = state.push('fence', 'code', 0);
            token.info = info;
            token.content = content;
            token.markup = '```';
            token.map = [startLine, startLine + 1];
        };

        const env: RenderEnv = state.env ?? {};
        const root = options.root ?? deduceRoot(env);
        const pagePath = env.realPath ?? env.path;
        const rawPath = state.src
            .slice(pos + OPERATOR.length, max)
            .trim()
            .replace(/^@/, root);
        const filePath = resolve(pagePath ? dirname(pagePath) : root, rawPath);

        if (!existsSync(filePath) || !statSync(filePath).isFile()) {
            pushFence('', `Vue snippet path not found: ${filePath}\n`);
            return true;
        }

        // Registers the file as a page dependency, so editing it hot-reloads the page.
        env.includes?.push(filePath);

        const blocks = sfcBlocks(readFileSync(filePath, 'utf-8').replace(/\r\n/g, '\n'));

        const open = state.push(`container_${containerName}_open`, 'div', 1);
        open.markup = ':::';
        open.info = ` ${containerName}`;
        open.map = [startLine, startLine + 1];

        // The code group renderer builds one tab per fence, titled with its `[title]`.
        blocks.forEach((block) => pushFence(`${block.lang}[${block.title}]`, `${block.content}\n`));

        state.push(`container_${containerName}_close`, 'div', -1).markup = ':::';

        return true;
    };

    // NOTE: For VitePress `<<<` rule only checks for three `<`, so ours has to be tried first when present.
    // This makes it compatible with VitePress and the ` snippet ` plugin.
    try {
        md.block.ruler.before('snippet', RULE, parser);
    } catch {
        md.block.ruler.before('fence', RULE, parser);
    }
};

export default vueSnippet;
