<script setup lang="ts">
import ThemeSchema from './modules/theme-schema.vue';
import ThemeColor from './modules/theme-color.vue';

defineOptions({
  name: 'AppearanceSettings'
});
</script>

<template>
  <div class="flex-col-stretch gap-16px">
    <ThemeSchema />
    <ThemeColor />
  </div>
</template>

<style scoped></style>
