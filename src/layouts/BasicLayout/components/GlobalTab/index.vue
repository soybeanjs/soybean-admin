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
    <n-space v-if="theme.multiTabStyle.mode === 'button'" :align="'center'" size="small" class="h-full">
      <button-tab
        v-for="item in app.multiTab.routes"
        :key="item.path"
        :active="app.multiTab.activeRoute === item.fullPath"
        :closable="item.name !== ROUTE_HOME.name"
        @click="handleClickTab(item.fullPath)"
        @close="removeMultiTab(item.fullPath)"
        @contextmenu="handleContextMenu($event, item.fullPath)"
      >
        {{ item.meta?.title }}
      </button-tab>
    </n-space>
    <browser-tab v-if="theme.multiTabStyle.mode === 'browser'" />
    <reload-button />
    <context-menu
      :visible="dropdownVisible"
      :current-path="dropdownConfig.currentPath"
      :x="dropdownConfig.x"
      :y="dropdownConfig.y"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { NSpace } from 'naive-ui';
import { useThemeStore, useAppStore } from '@/store';
import { ROUTE_HOME } from '@/router';
import { ButtonTab, BrowserTab, ReloadButton, ContextMenu } from './components';
import { useBoolean } from '@/hooks';

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
const { bool: dropdownVisible, setTrue: showDropdown, setFalse: hideDropdown } = useBoolean();

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
  hideDropdown();
  setDropdownConfig(e.clientX, e.clientY, fullPath);
  nextTick(() => {
    showDropdown();
  });
}

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
