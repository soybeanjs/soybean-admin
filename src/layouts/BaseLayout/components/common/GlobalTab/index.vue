<template>
  <div class="multi-tab flex-center w-full pl-16px">
    <div class="flex-1-hidden h-full">
      <better-scroll :options="{ scrollX: true, scrollY: false, click: true }">
        <multi-tab />
      </better-scroll>
    </div>
    <reload-button />
  </div>
</template>

<script lang="ts" setup>
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '@/store';
import { BetterScroll } from '@/components';
import { MultiTab, ReloadButton } from './components';

const route = useRoute();
const { initMultiTab, addMultiTab, setActiveMultiTab } = useAppStore();

function init() {
  initMultiTab();
}

watch(
  () => route.fullPath,
  newValue => {
    addMultiTab(route);
    setActiveMultiTab(newValue);
  }
);

// 初始化
init();
</script>
<style scoped>
.multi-tab {
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
}
</style>
