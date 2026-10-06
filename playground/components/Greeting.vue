<template>
    <p>{{ t('hello', { name }) }}</p>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

defineProps<{ name: string }>();

const { t } = useI18n({ useScope: 'local' });
</script>

<i18n lang="json">
{
    "en": { "hello": "Hello, {name}!" },
    "fr": { "hello": "Bonjour, {name} !" }
}
</i18n>
