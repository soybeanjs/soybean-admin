<template>
  <div v-if="fixedHeaderAndTab && theme.navStyle.mode !== 'horizontal-mix'" class="multi-tab-height w-full"></div>
  <div
    class="multi-tab flex-center justify-between w-full pl-10px"
    :class="[theme.darkMode ? 'bg-[#18181c]' : 'bg-white', { 'multi-tab-top absolute': fixedHeaderAndTab }]"
    :style="{ zIndex }"
    :align="'center'"
    justify="space-between"
    :item-style="{ paddingTop: '0px', paddingBottom: '0px' }"
  >
    <div class="flex-1-hidden h-full">
      <better-scroll :options="{ scrollX: true, scrollY: false }">
        <multi-tab />
      </better-scroll>
    </div>
    <reload-button />
  </div>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useThemeStore, useAppStore } from '@/store';
import { BetterScroll } from '@/components';
import { MultiTab, ReloadButton } from './components';

interface Props {
  /** 层级z-index */
  zIndex?: number;
}

withDefaults(defineProps<Props>(), {
  zIndex: 0
});

const route = useRoute();
const theme = useThemeStore();
const { initMultiTab, addMultiTab, setActiveMultiTab } = useAppStore();

const fixedHeaderAndTab = computed(() => theme.fixedHeaderAndTab || theme.navStyle.mode === 'horizontal-mix');
const multiTabHeight = computed(() => {
  const { height } = theme.multiTabStyle;
  return `${height}px`;
});
const headerHeight = computed(() => {
  const { height } = theme.headerStyle;
  return `${height}px`;
});

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
  height: v-bind(multiTabHeight);
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
}
.multi-tab-height {
  height: v-bind(multiTabHeight);
}
.multi-tab-top {
  top: v-bind(headerHeight);
}
</style>
