# markdown-it-sfc-tabs-snippet

[![npm version](https://img.shields.io/npm/v/markdown-it-sfc-tabs-snippet)](https://www.npmjs.com/package/markdown-it-sfc-tabs-snippet)
[![CI](https://github.com/Okamidev/markdown-it-sfc-tabs-snippet/actions/workflows/ci.yml/badge.svg)](https://github.com/Okamidev/markdown-it-sfc-tabs-snippet/actions/workflows/ci.yml)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)

A [markdown-it](https://github.com/markdown-it/markdown-it) plugin that imports a Vue Single File
Component into your markdown as a group of code blocks — one per block the SFC declares. In
[VitePress](https://vitepress.dev), those render as tabs.

Write this:

```md
<<<vue ./components/Counter.vue
```

Get a tabbed code group holding the component's `<template>`, `<script setup>` and `<style>`, each
syntax-highlighted with its own language, all read from the real file so the docs can never drift
from the code.

## Install

```sh
npm i -D markdown-it-sfc-tabs-snippet
```

`markdown-it` and `vue` are peer dependencies — the plugin uses `vue/compiler-sfc` to parse the
component, so the parse always matches the Vue version your project already has.

| Peer          | Range              |
| ------------- | ------------------ |
| `markdown-it` | `^13.0.0`, `^14.0.0` |
| `vue`         | `^3.3.0`           |

## Setup

### VitePress

```ts
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

No options needed: the plugin reads the page path VitePress passes in the render environment, so
relative paths and `@` resolve on their own, and it registers each imported SFC as a page
dependency so editing the component hot-reloads the page.

### Plain markdown-it

```ts
import MarkdownIt from 'markdown-it';
import vueSnippet from 'markdown-it-sfc-tabs-snippet';

const md = new MarkdownIt().use(vueSnippet, { root: process.cwd() });

// `path` tells the plugin which page is rendering, so relative paths resolve against it.
md.render(source, { path: '/docs/guide/index.md' });
```

Outside VitePress there is no `code-group` renderer, so the wrapper falls back to a plain `<div>`
around the code blocks rather than tabs. The blocks themselves are ordinary `fence` tokens and
render normally.

## Syntax

```md
<<<vue ./Counter.vue           relative to the markdown file
<<<vue ../shared/Button.vue    parent directories work
<<<vue @/components/Card.vue   `@` is the markdown root
```

The operator must start the line (indenting it four spaces or more makes it an ordinary code block,
as usual in markdown). Everything after `<<<vue` is the path, trimmed.

A leading `@` is replaced by the `root` option, or by the markdown root deduced from the render
environment. Every other path is resolved against the directory of the markdown file being
rendered.

If the path does not resolve to a file, the plugin emits a code block reading
`Vue snippet path not found: <path>` instead of throwing, so one bad path doesn't fail your build.

## Blocks and tabs

Each block in the SFC becomes one tab, in this order:

| SFC block          | Tab title       | Language            |
| ------------------ | --------------- | ------------------- |
| `<template>`       | `template`      | `vue-html`          |
| `<script setup>`   | `script setup`  | `lang` attr, else `js`  |
| `<script>`         | `script`        | `lang` attr, else `js`  |
| `<style>`          | `style`         | `lang` attr, else `css` |
| `<style scoped>`   | `style scoped`  | `lang` attr, else `css` |
| custom block       | the block name  | `lang` attr, else `txt` |

Multiple `<style>` blocks and custom blocks (`<i18n>`, `<docs>`, …) each get their own tab, in
source order. Blocks the file doesn't declare are simply absent — no empty tabs.

Content is cleaned up on the way in: surrounding blank lines are dropped, and the indentation
shared by every line is removed, so `<template>` content isn't shifted right by the tag it sits in.

So this component:

```vue
<template>
    <button @click="count++">Count is {{ count }}</button>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);
</script>

<style scoped>
button {
    color: rebeccapurple;
}
</style>
```

produces three tabs — **template** (`vue-html`), **script setup** (`ts`) and **style scoped**
(`css`) — each holding that block's contents, dedented.

## Options

```ts
md.use(vueSnippet, {
    root: '/abs/path/to/docs',
    containerName: 'code-group',
});
```

### `root`

Type: `string` · Default: deduced from the render environment, falling back to `process.cwd()`

Directory the `@` path prefix points to. VitePress supplies enough information to deduce this, so
you normally leave it unset; set it when driving markdown-it yourself.

### `containerName`

Type: `string` · Default: `'code-group'`

Name of the container whose tokens wrap the code blocks. The default matches VitePress's
`::: code-group`, which is what renders the group as tabs. Point it at another container if you
have your own renderer; a container with no renderer falls back to plain `<div>` wrappers.

## How it hooks in

The plugin adds a block rule named `vue-snippet` to markdown-it's ruler. Placement matters:
VitePress ships its own `<<<` snippet operator, and since it tests only for three `<`, it would
otherwise claim `<<<vue` lines and treat `vue ./Counter.vue` as the path. So the rule inserts
itself before VitePress's `snippet` rule when that rule is present, and before the built-in `fence`
rule otherwise.

## Requirements

Node 20 or newer. The plugin only reads files at render time — nothing is written, and the SFC is
never compiled, only parsed.

## Contributing

Issues and pull requests are welcome. [CONTRIBUTING.md](./CONTRIBUTING.md) covers the development
setup, the available scripts and the commit conventions. Please follow the
[Code of Conduct](./CODE_OF_CONDUCT.md), and report security problems privately as described in
[SECURITY.md](./SECURITY.md).

## License

[MIT](./LICENSE)
