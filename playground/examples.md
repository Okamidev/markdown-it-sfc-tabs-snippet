# Examples

Every snippet on this page is produced by a single `<<<vue` line pointing at a component in
[`playground/components`](https://github.com/Okamidev/markdown-it-sfc-tabs-snippet/tree/main/playground/components).
Run `npm run docs:dev`, edit one of those files, and the page updates.

<script setup>
import Counter from './components/Counter.vue';
import TodoList from './components/TodoList.vue';
</script>

## Template, script setup and scoped style

```md
<<<vue ./components/Counter.vue
```

<div class="demo">
    <Counter />
</div>

<<<vue ./components/Counter.vue

## Both script blocks and several styles

A plain `<script>` next to `<script setup>` gets its own tab, and so does each `<style>`, scoped or
not, in source order.

```md
<<<vue ./components/TodoList.vue
```

<div class="demo">
    <TodoList />
</div>

<<<vue ./components/TodoList.vue

## Custom blocks

Custom blocks such as `<i18n>` become a tab named after the block, highlighted with its `lang`
attribute.

```md
<<<vue ./components/Greeting.vue
```

<<<vue ./components/Greeting.vue

## Path from the markdown root

A leading `@` points to the markdown root, wherever the page sits.

```md
<<<vue @/components/Counter.vue
```

<<<vue @/components/Counter.vue

## Missing file

A path that does not resolve to a file renders a message instead of failing the build.

```md
<<<vue ./components/Missing.vue
```

<<<vue ./components/Missing.vue
