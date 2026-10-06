import { defineConfig } from 'vitepress';
// Imported from the sources rather than the published package, so the site always shows the
// plugin as it is in this checkout.
import vueSnippet from '../../src/index.ts';

const repository = 'https://github.com/Okamidev/markdown-it-sfc-tabs-snippet';

export default defineConfig({
    title: 'markdown-it-sfc-tabs-snippet',
    description: 'Import a Vue Single File Component into markdown as tabbed code blocks.',
    // Served from GitHub Pages under the repository name.
    base: '/markdown-it-sfc-tabs-snippet/',
    cleanUrls: true,
    markdown: {
        config: (md) => {
            md.use(vueSnippet);
        },
    },
    themeConfig: {
        nav: [
            { text: 'Examples', link: '/examples' },
            { text: 'npm', link: 'https://www.npmjs.com/package/markdown-it-sfc-tabs-snippet' },
        ],
        outline: 'deep',
        socialLinks: [{ icon: 'github', link: repository }],
        editLink: {
            pattern: `${repository}/edit/main/playground/:path`,
        },
        footer: {
            message: 'Released under the MIT License.',
        },
    },
});
