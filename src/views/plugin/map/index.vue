<template>
  <div class="h-full">
    <n-card title="地图插件" class="h-full shadow-sm rounded-16px" content-style="overflow:hidden">
      <n-tabs type="line" class="flex-col-stretch h-full" pane-class="flex-1-hidden">
        <n-tab-pane v-for="item in maps" :key="item.id" :name="item.id" :tab="item.label">
          <component :is="item.component" />
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import { BaiduMap, GaodeMap, TencentMap } from './components';

interface Map {
  id: string;
  label: string;
  component: Component;
}

const maps: Map[] = [
  { id: 'gaode', label: '高德地图', component: GaodeMap },
  { id: 'tencent', label: '腾讯地图', component: TencentMap },
  { id: 'baidu', label: '百度地图', component: BaiduMap }
];
</script>

<style scoped></style>
