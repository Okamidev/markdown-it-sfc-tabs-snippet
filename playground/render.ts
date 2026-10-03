/**
 * Renders `page.md` with the plugin installed and prints the HTML, plus the token stream the
 * plugin produced. Run with `npm run playground` — Node strips the types, no build needed.
 *
 * Plain markdown-it has no `code-group` renderer, so the container tokens fall back to `<div>`
 * wrappers. Use a VitePress site to see them as actual tabs.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';
import vueSnippet from '../src/index.ts';

const here = dirname(fileURLToPath(import.meta.url));
const path = join(here, 'page.md');
const source = readFileSync(path, 'utf-8');

const md = new MarkdownIt().use(vueSnippet);

// `path` is the convention VitePress uses to tell the plugin which page is rendering. Each pass
// gets a fresh env, the plugin appending to `includes` every time it parses the operator.
const newEnv = () => ({ path, includes: [] as string[] });

console.log('--- tokens ---');
for (const token of md.parse(source, newEnv())) {
    const label = token.type === 'fence' ? `fence  ${token.info}` : token.type;

    console.log(`  ${label}`);
}

const env = newEnv();

console.log('\n--- html ---');
console.log(md.render(source, env));

console.log('--- hot reload dependencies ---');
console.log(env.includes.length > 0 ? env.includes : '  (none)');
