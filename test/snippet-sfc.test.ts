import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import MarkdownIt from 'markdown-it';
import { describe, expect, it } from 'vitest';
import vueSnippet from '../src/index.js';

const SFC = `<template>
    <p>{{ message }}</p>
</template>

<script setup lang="ts">
const message = 'hello';
</script>

<style scoped>
p {
    color: red;
}
</style>
`;

/**
 * Renders markdown with the plugin installed, the SFC living in a throwaway directory the
 * `root` option points to.
 */
const render = (source: string, root: string): string => {
    const md = new MarkdownIt().use(vueSnippet, { root });

    return md.render(source, { path: join(root, 'page.md') });
};

describe('vueSnippet', () => {
    it('renders one fence per SFC block', () => {
        const root = mkdtempSync(join(tmpdir(), 'sfc-tabs-'));
        writeFileSync(join(root, 'Demo.vue'), SFC);

        const html = render('<<<vue ./Demo.vue', root);

        expect(html).toContain('language-vue-html');
        expect(html).toContain('language-ts');
        expect(html).toContain('language-css');
        expect(html).toContain('hello');
    });

    it('reports a missing path instead of throwing', () => {
        const root = mkdtempSync(join(tmpdir(), 'sfc-tabs-'));

        expect(render('<<<vue ./Missing.vue', root)).toContain('Vue snippet path not found');
    });
});
