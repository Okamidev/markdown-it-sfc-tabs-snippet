# Changelog

## 0.1.0 (2026-10-04)

First public release.

### Features

* **`<<<vue` operator**: `<<<vue ./path/to/Component.vue` imports a Vue Single File Component
  into markdown as a group of code blocks, one per block the SFC declares. In VitePress, the group
  renders as tabs through the built-in `code-group` container.
* **One tab per SFC block**, in a fixed order: `template` (`vue-html`), `script setup`, `script`,
  then every `<style>` (`style` or `style scoped`) and custom block (`<i18n>`, `<docs>`, …) in
  source order. Each tab is highlighted with the block's `lang` attribute, falling back to `js`,
  `css` or `txt`. Blocks the file doesn't declare produce no tab.
* **Path resolution**: paths are resolved against the markdown file being rendered, and a leading
  `@` points to the markdown root, deduced from the render environment or set with `root`.
* **VitePress integration with no configuration**: the rule is registered before VitePress's own
  `<<<` snippet rule so it doesn't steal `<<<vue` lines, and each imported SFC is registered as a
  page dependency so editing it hot-reloads the page.
* **Plain markdown-it support**: outside VitePress the group falls back to a plain `<div>` around
  ordinary `fence` tokens.
* **Options**: `root` (directory the `@` prefix points to) and `containerName` (container wrapping
  the code blocks, `code-group` by default).
* **Non-fatal missing files**: a path that doesn't resolve to a file renders a
  `Vue snippet path not found: <path>` code block instead of failing the build.
* Works with `markdown-it` 13 and 14 and `vue` 3.3+ (peer dependencies), on Node 20 or newer.
  Ships as ESM with TypeScript declarations.
