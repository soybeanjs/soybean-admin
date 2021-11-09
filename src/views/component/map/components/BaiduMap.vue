<template>
  <div ref="domRef" class="w-full h-full"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { BAIDU_MAP_SDK_URL } from '@/settings';
import { useScript } from '@/hooks';

const { load } = useScript(BAIDU_MAP_SDK_URL);

const domRef = ref<HTMLDivElement | null>(null);

async function renderBaiduMap() {
  await load();
  await nextTick();
  const map = new BMapGL.Map(domRef.value!);
  const point = new BMapGL.Point(116.404, 39.915);
  map.centerAndZoom(point, 15);
  map.enableScrollWheelZoom();
}

onMounted(() => {
  renderBaiduMap();
});
</script>
<style scoped></style>
