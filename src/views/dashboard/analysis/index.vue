<template>
  <n-space :vertical="true" :size="16">
    <top-chart />
    <data-card />
    <bottom-part />
  </n-space>
</template>

<script lang="ts" setup>
import { NSpace } from 'naive-ui';
import { TopChart, DataCard, BottomPart } from './components';
</script>
<style scoped></style>
