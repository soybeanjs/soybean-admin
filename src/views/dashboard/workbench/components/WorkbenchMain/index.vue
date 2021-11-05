<template>
  <n-grid cols="s:1 m:2" responsive="screen" :x-gap="16" :y-gap="16">
    <n-grid-item>
      <n-space :vertical="true" :size="16">
        <n-card title="项目" :bordered="false" size="small" class="shadow-sm rounded-16px">
          <template #header-extra>
            <a class="g_text-primary" href="javascript:;">全部项目</a>
          </template>
        </n-card>
        <n-card title="动态" :bordered="false" size="small" class="shadow-sm rounded-16px">
          <template #header-extra>
            <a class="g_text-primary" href="javascript:;">更多动态</a>
          </template>
        </n-card>
      </n-space>
    </n-grid-item>
    <n-grid-item>
      <n-space :vertical="true" :size="16">
        <n-card title="快捷操作" :bordered="false" size="small" class="shadow-sm rounded-16px"></n-card>
        <n-card title="XX指数" :bordered="false" size="small" class="shadow-sm rounded-16px"></n-card>
      </n-space>
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
import { NGrid, NGridItem, NSpace, NCard } from 'naive-ui';
</script>
<style scoped></style>
