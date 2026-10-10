<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import { useScriptTag } from '@vueuse/core';
import { TENCENT_MAP_SDK_URL } from '../map-sdk';

/**
 * 腾讯地图（P4-01）。
 *
 * `new TMap.Map(...)` 的实例没有后续操作，因此故意不赋值 —— 加上
 * `no-new` 抑制注释说明这是有意为之（否则 lint 会拦）。
 */
defineOptions({ name: 'TencentMap' });

const domRef = useTemplateRef<HTMLDivElement>('mapRef');

const { load } = useScriptTag(TENCENT_MAP_SDK_URL);

async function renderMap() {
  await load(true);

  if (!domRef.value) {
    return;
  }

  // oxlint-disable-next-line no-new
  new TMap.Map(domRef.value, {
    center: new TMap.LatLng(39.98412, 116.307484),
    zoom: 11,
    viewMode: '3D'
  });
}

onMounted(() => {
  void renderMap();
});
</script>

<template>
  <div ref="mapRef" class="h-full w-full" />
</template>
