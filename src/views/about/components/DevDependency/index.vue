<template>
  <n-card title="开发环境依赖" :bordered="false" size="small" class="rounded-16px shadow-sm">
    <n-descriptions label-placement="left" bordered size="small">
      <n-descriptions-item v-for="item in dependencies" :key="item.name" :label="item.name">
        {{ item.version }}
      </n-descriptions-item>
    </n-descriptions>
  </n-card>
</template>

<script setup lang="ts">
import { NCard, NDescriptions, NDescriptionsItem } from 'naive-ui';
import { packageJson } from '@/utils';

const dependencies = packageJson.devDependencies;
</script>
<style scoped></style>
