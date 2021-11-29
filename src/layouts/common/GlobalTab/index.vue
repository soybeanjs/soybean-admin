<template>
  <div class="multi-tab flex-center w-full pl-16px" :style="{ height: multiTabHeight }">
    <div ref="bsWrapperRef" class="flex-1-hidden h-full">
      <better-scroll ref="bsScroll" :options="{ scrollX: true, scrollY: false, click: isMobile }">
        <multi-tab @scroll="handleScroll" />
      </better-scroll>
    </div>
    <reload-button />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useElementBounding } from '@vueuse/core';
import { useAppStore } from '@/store';
import { useLayoutConfig, routeFullPathWatcher, useIsMobile } from '@/composables';
import { BetterScroll } from '@/components';
import type { ExposeBetterScroll } from '@/interface';
import { MultiTab, ReloadButton } from './components';

const route = useRoute();
const { initMultiTab, addMultiTab, setActiveMultiTab } = useAppStore();
const { multiTabHeight } = useLayoutConfig();
const isMobile = useIsMobile();

const bsWrapperRef = ref<HTMLElement | null>(null);
const { width: bsWrapperWidth, left: bsWrapperLeft } = useElementBounding(bsWrapperRef);

const bsScroll = ref<ExposeBetterScroll | null>(null);

function handleScroll(clientX: number) {
  const currentX = clientX - bsWrapperLeft.value;
  const deltaX = currentX - bsWrapperWidth.value / 2;
  if (bsScroll.value) {
    const { maxScrollX, x: leftX } = bsScroll.value.bsInstance;
    const rightX = maxScrollX - leftX;
    const update = deltaX > 0 ? Math.max(-deltaX, rightX) : Math.min(-deltaX, -leftX);
    bsScroll.value?.bsInstance.scrollBy(update, 0, 300);
  }
}

function init() {
  initMultiTab();
}

routeFullPathWatcher(fullPath => {
  addMultiTab(route);
  setActiveMultiTab(fullPath);
});

// 初始化
init();
</script>
<style scoped>
.multi-tab {
  box-shadow: 0 1px 2px rgb(0 21 41 / 8%);
}
</style>
