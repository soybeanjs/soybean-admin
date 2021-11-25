<template>
  <div v-if="theme.multiTabStyle.mode === 'chrome'" ref="tabRef" class="flex items-end h-full">
    <chrome-tab
      v-for="(item, index) in app.multiTab.routes"
      :key="item.path"
      :is-active="app.multiTab.activeRoute === item.fullPath"
      :primary-color="theme.themeColor"
      :closable="item.name !== ROUTE_HOME.name"
      :dark-mode="theme.darkMode"
      :is-last="index === app.multiTab.routes.length - 1"
      @click="handleClickTab(item.fullPath)"
      @close="removeMultiTab(item.fullPath)"
      @contextmenu="handleContextMenu($event, item.fullPath)"
    >
      {{ item.meta?.title }}
    </chrome-tab>
  </div>
  <div v-if="theme.multiTabStyle.mode === 'button'" ref="tabRef" class="flex-y-center h-full">
    <button-tab
      v-for="item in app.multiTab.routes"
      :key="item.path"
      class="mr-10px"
      :is-active="app.multiTab.activeRoute === item.fullPath"
      :primary-color="theme.themeColor"
      :closable="item.name !== ROUTE_HOME.name"
      :dark-mode="theme.darkMode"
      @click="handleClickTab(item.fullPath)"
      @close="removeMultiTab(item.fullPath)"
      @contextmenu="handleContextMenu($event, item.fullPath)"
    >
      {{ item.meta?.title }}
    </button-tab>
  </div>
  <context-menu
    :visible="dropdownVisible"
    :current-path="dropdownConfig.currentPath"
    :x="dropdownConfig.x"
    :y="dropdownConfig.y"
  />
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, watch } from 'vue';
import { useEventListener } from '@vueuse/core';
import { useThemeStore, useAppStore } from '@/store';
import { ROUTE_HOME } from '@/router';
import { ChromeTab, ButtonTab } from '@/components';
import { useBoolean } from '@/hooks';
import { setTabRouteStorage } from '@/utils';
import { ContextMenu } from './components';

interface Emits {
  (e: 'scroll', clientX: number): void;
}

const emit = defineEmits<Emits>();

const theme = useThemeStore();
const app = useAppStore();
const { removeMultiTab, handleClickTab } = useAppStore();
const { bool: dropdownVisible, setTrue: showDropdown, setFalse: hideDropdown } = useBoolean();

const dropdownConfig = reactive({
  x: 0,
  y: 0,
  currentPath: ''
});
function setDropdownConfig(x: number, y: number, currentPath: string) {
  Object.assign(dropdownConfig, { x, y, currentPath });
}

// 获取当前激活的tab的clientX
const tabRef = ref<HTMLElement | null>(null);
async function getActiveTabClientX() {
  await nextTick();
  const index = app.activeMultiTabIndex;
  if (tabRef.value) {
    const activeTabElement = tabRef.value.children[index];
    const { x, width } = activeTabElement.getBoundingClientRect();
    const clientX = x + width / 2;
    setTimeout(() => {
      emit('scroll', clientX);
    }, 50);
  }
}

// 右键菜单
function handleContextMenu(e: MouseEvent, fullPath: string) {
  e.preventDefault();
  const { clientX, clientY } = e;
  hideDropdown();
  setDropdownConfig(clientX, clientY, fullPath);
  nextTick(() => {
    showDropdown();
  });
}

/** 页面离开时缓存多页签数据 */
useEventListener(window, 'beforeunload', () => {
  setTabRouteStorage(app.multiTab.routes);
});

watch(
  () => app.activeMultiTabIndex,
  () => {
    getActiveTabClientX();
  },
  {
    immediate: true
  }
);
</script>
<style scoped></style>
