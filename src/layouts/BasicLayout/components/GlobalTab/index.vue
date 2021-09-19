<template>
  <div v-if="fixedHeaderAndTab && theme.navStyle.mode !== 'horizontal-mix'" class="multi-tab-height w-full"></div>
  <div
    class="multi-tab-height flex-center justify-between w-full px-10px"
    :class="{ 'multi-tab-top absolute': fixedHeaderAndTab, 'bg-[#18181c]': theme.darkMode }"
    :style="{ zIndex }"
    :align="'center'"
    justify="space-between"
    :item-style="{ paddingTop: '0px', paddingBottom: '0px' }"
  >
    <n-space v-if="theme.multiTabStyle.mode === 'button'" :align="'center'" size="small" class="h-full">
      <button-tab
        v-for="item in app.multiTab.routes"
        :key="item.path"
        :active="app.multiTab.activeRoute === item.fullPath"
        :closable="item.name !== ROUTE_HOME.name"
        @click="handleClickTab(item.fullPath)"
        @close="removeMultiTab(item.fullPath)"
      >
        {{ item.meta?.title }}
      </button-tab>
    </n-space>
    <n-space v-if="theme.multiTabStyle.mode === 'browser'" :align="'flex-end'" :size="0" class="h-full px-16px">
      <browser-tab
        v-for="(item, index) in app.multiTab.routes"
        :key="item.path"
        v-model:hover-index="hoverIndex"
        :current-index="index"
        :active-index="app.activeMultiTabIndex"
        :closable="item.name !== ROUTE_HOME.name"
        @click="handleClickTab(item.fullPath)"
        @close="removeMultiTab(item.fullPath)"
      >
        {{ item.meta?.title }}
      </browser-tab>
    </n-space>
    <div class="flex-center w-32px h-32px bg-white cursor-pointer" @click="handleReload">
      <icon-mdi-refresh class="text-16px" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { NSpace } from 'naive-ui';
import { useThemeStore, useAppStore } from '@/store';
import { useReloadInject } from '@/context';
import { ROUTE_HOME } from '@/router';
import { ButtonTab, BrowserTab } from './components';

defineProps({
  zIndex: {
    type: Number,
    default: 0
  }
});

const route = useRoute();
const theme = useThemeStore();
const app = useAppStore();
const { initMultiTab, addMultiTab, removeMultiTab, setActiveMultiTab, handleClickTab } = useAppStore();
const { handleReload } = useReloadInject();

const hoverIndex = ref(NaN);

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
.multi-tab-height {
  height: v-bind(multiTabHeight);
}
.multi-tab-top {
  top: v-bind(headerHeight);
}
</style>
