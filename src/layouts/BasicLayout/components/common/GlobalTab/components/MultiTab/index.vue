<template>
  <div v-if="theme.multiTabStyle.mode === 'chrome'" class="flex items-end h-full">
    <chrome-tab
      v-for="item in app.multiTab.routes"
      :key="item.path"
      :is-active="app.multiTab.activeRoute === item.fullPath"
      :primary-color="theme.themeColor"
      :closable="item.name !== ROUTE_HOME.name"
      :dark-mode="theme.darkMode"
      @click="handleClickTab(item.fullPath)"
      @close="removeMultiTab(item.fullPath)"
      @contextmenu="handleContextMenu($event, item.fullPath)"
    >
      {{ item.meta?.title }}
    </chrome-tab>
  </div>
  <div v-if="theme.multiTabStyle.mode === 'button'" class="flex-y-center h-full">
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
import { reactive, nextTick } from 'vue';
import { useThemeStore, useAppStore } from '@/store';
import { ROUTE_HOME } from '@/router';
import { ChromeTab, ButtonTab } from '@/components';
import { useBoolean } from '@/hooks';
import { ContextMenu } from './components';

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

function handleContextMenu(e: MouseEvent, fullPath: string) {
  e.preventDefault();
  const { clientX, clientY } = e;
  hideDropdown();
  setDropdownConfig(clientX, clientY, fullPath);
  nextTick(() => {
    showDropdown();
  });
}
</script>
<style scoped></style>
