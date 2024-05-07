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

<template>
  <div class="h-full">
    <NCard title="地图插件" :bordered="false" class="h-full card-wrapper" content-style="overflow:hidden">
      <NTabs type="line" class="h-full flex-col-stretch" pane-class="flex-1-hidden">
        <NTabPane v-for="item in maps" :key="item.id" :name="item.id" :tab="item.label">
          <component :is="item.component" />
        </NTabPane>
      </NTabs>
    </NCard>
  </div>
</template>

<style scoped></style>
