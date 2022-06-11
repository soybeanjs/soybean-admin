<template>
  <div ref="domRef" class="w-full h-full"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useScriptTag } from '@vueuse/core';
import { BAIDU_MAP_SDK_URL } from '@/config';

const { load } = useScriptTag(BAIDU_MAP_SDK_URL);

const domRef = ref<HTMLDivElement>();

async function renderMap() {
  await load(true);
  if (!domRef.value) return;
  const map = new BMap.Map(domRef.value);
  const point = new BMap.Point(114.05834626586915, 22.546789983033168);
  map.centerAndZoom(point, 15);
  map.enableScrollWheelZoom();
}

onMounted(() => {
  renderMap();
});
</script>

<style scoped></style>
