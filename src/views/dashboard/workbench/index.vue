<template>
  <n-space :vertical="true" :size="16">
    <workbench-header />
    <workbench-main />
  </n-space>
</template>

<script lang="ts" setup>
import { WorkbenchHeader, WorkbenchMain } from './components';
</script>

<style scoped></style>
