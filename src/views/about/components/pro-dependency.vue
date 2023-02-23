<template>
  <n-card title="生产环境依赖" :bordered="false" size="small" class="rounded-16px shadow-sm">
    <n-descriptions label-placement="left" bordered size="small">
      <n-descriptions-item v-for="item in dependencies" :key="item.name" :label="item.name">
        {{ item.version }}
      </n-descriptions-item>
    </n-descriptions>
  </n-card>
</template>

<script setup lang="ts">
import { pkgJson } from './model';

defineOptions({ name: 'ProDependency' });

const { dependencies } = pkgJson;
</script>

<style scoped></style>
