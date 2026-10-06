<template>
    <form class="todo-form" @submit.prevent="add">
        <input v-model="draft" placeholder="What needs doing?" />
        <button type="submit" :disabled="!draft.trim()">Add</button>
    </form>
    <ul>
        <li v-for="todo in todos" :key="todo.id" :class="{ done: todo.done }">
            <label><input v-model="todo.done" type="checkbox" /> {{ todo.text }}</label>
        </li>
    </ul>
</template>

<script lang="ts">
export interface Todo {
    id: number;
    text: string;
    done: boolean;
}
</script>

<script setup lang="ts">
import { ref } from 'vue';

const draft = ref('');
const todos = ref<Todo[]>([{ id: 1, text: 'Read the real file', done: true }]);

const add = (): void => {
    todos.value.push({ id: todos.value.length + 1, text: draft.value.trim(), done: false });
    draft.value = '';
};
</script>

<style scoped>
.todo-form {
    display: flex;
    gap: 8px;
}

.done {
    text-decoration: line-through;
    opacity: 0.6;
}
</style>

<style>
.todo-form input {
    padding: 4px 8px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 6px;
}
</style>
