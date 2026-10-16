<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import { useScriptTag } from '@vueuse/core';
import { BAIDU_MAP_SDK_URL } from '../map-sdk';

/** 百度地图（P4-01） 详见 docs/v3-notes.md N-359。 */
defineOptions({ name: 'BaiduMap' });

window.HOST_TYPE = '2';

const domRef = useTemplateRef<HTMLDivElement>('mapRef');

const { load } = useScriptTag(BAIDU_MAP_SDK_URL);

async function renderMap() {
  await load(true);

  if (!domRef.value) {
    return;
  }

  const map = new BMap.Map(domRef.value);
  const point = new BMap.Point(114.05834626586915, 22.546789983033168);

  map.centerAndZoom(point, 15);
  map.enableScrollWheelZoom();
}

onMounted(() => {
  void renderMap();
});
</script>

<template>
  <div ref="mapRef" class="h-full w-full" />
</template>
