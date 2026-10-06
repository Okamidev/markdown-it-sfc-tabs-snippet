---
layout: home

hero:
  name: markdown-it-sfc-tabs-snippet
  text: Vue components in your docs, straight from the source
  tagline: One line of markdown imports a .vue file as tabbed code blocks, so the docs can never drift from the code.
  actions:
    - theme: brand
      text: See the examples
      link: /examples
    - theme: alt
      text: View on GitHub
      link: https://github.com/Okamidev/markdown-it-sfc-tabs-snippet

features:
  - title: Never out of date
    details: Tabs are read from the real component file at build time. Change the component, the docs follow.
  - title: One tab per block
    details: template, script setup, script, every style and custom block, each highlighted with its own language.
  - title: Zero config in VitePress
    details: Paths resolve against the page, and editing the component hot-reloads the page.
  - title: Plain markdown-it too
    details: It's a regular markdown-it plugin. Outside VitePress, the blocks render as ordinary code blocks in a wrapper you can style or turn into tabs.
---

<script setup>
import Counter from './components/Counter.vue';
</script>

## Write this

```md
<<<vue ./components/Counter.vue
```

## Get this

<<<vue ./components/Counter.vue

And since the docs import the same file, the live component is one line away:

<div class="demo">
    <Counter />
</div>

## Install

```sh
npm i -D markdown-it-sfc-tabs-snippet
```

Then register it with VitePress, or with any markdown-it instance:

::: code-group

```ts [VitePress]
// .vitepress/config.ts
import { defineConfig } from 'vitepress';
import vueSnippet from 'markdown-it-sfc-tabs-snippet';

export default defineConfig({
    markdown: {
        config: (md) => {
            md.use(vueSnippet);
        },
    },
});
```

```ts [markdown-it]
import MarkdownIt from 'markdown-it';
import vueSnippet from 'markdown-it-sfc-tabs-snippet';

const md = new MarkdownIt().use(vueSnippet, { root: process.cwd() });

// `path` tells the plugin which page is rendering, so relative paths resolve against it.
md.render(source, { path: '/docs/guide/index.md' });
```

:::

VitePress renders the group as tabs. Plain markdown-it has no `code-group` renderer, so the code
blocks come out as ordinary `<pre><code>` blocks inside a `<div>` wrapper. The `containerName`
option lets you plug in your own container renderer.

The [README](https://github.com/Okamidev/markdown-it-sfc-tabs-snippet#readme) covers the syntax,
the options and plain markdown-it usage in detail.
