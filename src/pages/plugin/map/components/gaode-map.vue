<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import { useScriptTag } from '@vueuse/core';
import { AMAP_SDK_URL } from '../map-sdk';

/** 高德地图（P4-01） 详见 docs/v3-notes.md N-360。 */
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
