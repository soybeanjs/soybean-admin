<template>
  <div ref="domRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useScriptTag } from '@vueuse/core';
import { TENCENT_MAP_SDK_URL } from '@/config';

const { load } = useScriptTag(TENCENT_MAP_SDK_URL);

const domRef = ref<HTMLDivElement | null>(null);

async function renderBaiduMap() {
  if (!domRef.value) return;
  await load(true);
  const map = new TMap.Map(domRef.value, {
    center: new TMap.LatLng(39.98412, 116.307484),
    zoom: 11,
    viewMode: '3D'
  });
  // eslint-disable-next-line no-console
  console.log('map: ', map);
}

onMounted(() => {
  renderBaiduMap();
});
</script>
<style scoped></style>
