<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import { useScriptTag } from '@vueuse/core';
import { BAIDU_MAP_SDK_URL } from '../map-sdk';

/**
 * 百度地图（P4-01）。
 *
 * `window.HOST_TYPE = '2'` 是百度 GL 分支的开关，必须在脚本加载**前**设置；
 * v2 把它写在模块顶层（import 时执行）—— 这是对的，但副作用发生在模块求值期。
 * 这里保留同一时机，并靠 `map-sdk.d.ts` 里的 `Window` 声明让它有类型。
 */
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
