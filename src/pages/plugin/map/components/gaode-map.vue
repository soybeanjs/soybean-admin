<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import { useScriptTag } from '@vueuse/core';
import { AMAP_SDK_URL } from '../map-sdk';

/**
 * 高德地图（P4-01）。
 *
 * SDK 是 UMD 包，`useScriptTag` 注入后从全局 `AMap` 取构造器；类型见
 * `map-sdk.d.ts`。脚本按 URL 去重，三个地图组件切换时不会重复注入。
 */
defineOptions({ name: 'GaodeMap' });

const domRef = useTemplateRef<HTMLDivElement>('mapRef');

const { load } = useScriptTag(AMAP_SDK_URL);

async function renderMap() {
  await load(true);

  if (!domRef.value) {
    return;
  }

  const map = new AMap.Map(domRef.value, {
    zoom: 11,
    center: [114.05834626586915, 22.546789983033168],
    viewMode: '3D'
  });

  map.getCenter();
}

onMounted(() => {
  void renderMap();
});
</script>

<template>
  <div ref="mapRef" class="h-full w-full" />
</template>
