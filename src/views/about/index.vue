<template>
  <n-space :vertical="true" :size="16">
    <project-introduction />
    <project-info />
    <pro-dependency />
    <dev-dependency />
  </n-space>
</template>

<script setup lang="ts">
import { onActivated, onMounted } from 'vue';
import { DevDependency, ProDependency, ProjectInfo, ProjectIntroduction } from './components';

onActivated(() => {
  console.log('about page activated');
});

onMounted(() => {
  console.log('about page mounted');
});
</script>

<style scoped></style>
