<template>
  <div ref="wrapRef" class="w-full h-full">
    <div ref="domRef" class="dom-ref-height"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useScriptTag, useElementSize } from '@vueuse/core';
import { TENCENT_MAP_SDK_URL } from '@/settings';

const { load } = useScriptTag(TENCENT_MAP_SDK_URL);

const wrapRef = ref<HTMLDivElement | null>(null);
const domRef = ref<HTMLDivElement | null>(null);

const { height: wrapRefHeight } = useElementSize(wrapRef);
const domRefHeight = computed(() => `${wrapRefHeight.value}px`);

async function renderBaiduMap() {
  await load(true);
  const map = new TMap.Map(domRef.value!, {
    center: new TMap.LatLng(39.98412, 116.307484),
    zoom: 11,
    viewMode: '3D'
  });

  return map;
}

onMounted(() => {
  renderBaiduMap();
});
</script>
<style scoped>
.dom-ref-height {
  height: v-bind(domRefHeight);
}
</style>
