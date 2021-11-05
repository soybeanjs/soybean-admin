<template>
  <shadow-card class="p-18px !rounded-4px">
    <h3 class="pb-18px text-16px font-semibold">生产环境依赖</h3>
    <n-descriptions label-placement="left" bordered size="small">
      <n-descriptions-item v-for="item in dependencies" :key="item.name" :label="item.name">
        {{ item.version }}
      </n-descriptions-item>
    </n-descriptions>
  </shadow-card>
</template>

<script setup lang="ts">
import { NDescriptions, NDescriptionsItem } from 'naive-ui';
import { packageJson } from '@/utils';

const { dependencies } = packageJson;
</script>
<style scoped></style>
