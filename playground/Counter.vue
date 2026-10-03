<template>
    <button type="button" @click="increment">Count is {{ count }}</button>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);

const increment = (): void => {
    count.value += 1;
};
</script>

<style scoped>
button {
    color: rebeccapurple;
}
</style>
