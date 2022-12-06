<template>
  <div ref="tabRef" class="h-full" :class="[isChromeMode ? 'flex items-end' : 'flex-y-center']">
    <component
      :is="activeComponent"
      v-for="(item, index) in tab.tabs"
      :key="item.fullPath"
      :is-active="tab.activeTab === item.fullPath"
      :primary-color="theme.themeColor"
      :closable="!(item.name === tab.homeTab.name || item.meta.affix)"
      :dark-mode="theme.darkMode"
      :class="{ '!mr-0': isChromeMode && index === tab.tabs.length - 1, 'mr-10px': !isChromeMode }"
      @click="tab.handleClickTab(item.fullPath)"
      @close="tab.removeTab(item.fullPath)"
      @contextmenu="handleContextMenu($event, item.fullPath, item.meta.affix)"
    >
      <svg-icon
        :icon="item.meta.icon"
        :local-icon="item.meta.localIcon"
        class="inline-block align-text-bottom mr-4px text-16px"
      />
      {{ item.meta.title }}
    </component>
  </div>
  <context-menu
    :visible="dropdown.visible"
    :current-path="dropdown.currentPath"
    :affix="dropdown.affix"
    :x="dropdown.x"
    :y="dropdown.y"
    @update:visible="handleDropdownVisible"
  />
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { ButtonTab, ChromeTab } from '@soybeanjs/vue-admin-tab';
import { useTabStore, useThemeStore } from '@/store';
import { ContextMenu } from './components';

defineOptions({ name: 'TabDetail' });

interface Emits {
  (e: 'scroll', clientX: number): void;
}

const emit = defineEmits<Emits>();

const theme = useThemeStore();
const tab = useTabStore();

const isChromeMode = computed(() => theme.tab.mode === 'chrome');
const activeComponent = computed(() => (isChromeMode.value ? ChromeTab : ButtonTab));

// 获取当前激活的tab的clientX
const tabRef = ref<HTMLElement>();
async function getActiveTabClientX() {
  await nextTick();
  if (tabRef.value && tabRef.value.children.length && tabRef.value.children[tab.activeTabIndex]) {
    const activeTabElement = tabRef.value.children[tab.activeTabIndex];
    const { x, width } = activeTabElement.getBoundingClientRect();
    const clientX = x + width / 2;
    setTimeout(() => {
      emit('scroll', clientX);
    }, 50);
  }
}

interface DropdownConfig {
  visible: boolean;
  affix: boolean;
  x: number;
  y: number;
  currentPath: string;
}

const dropdown: DropdownConfig = reactive({
  visible: false,
  affix: false,
  x: 0,
  y: 0,
  currentPath: ''
});

function setDropdown(config: Partial<DropdownConfig>) {
  Object.assign(dropdown, config);
}

let isClickContextMenu = false;

function handleDropdownVisible(visible: boolean) {
  if (!isClickContextMenu) {
    setDropdown({ visible });
  }
}

/** 点击右键菜单 */
async function handleContextMenu(e: MouseEvent, currentPath: string, affix?: boolean) {
  e.preventDefault();

  const { clientX, clientY } = e;

  isClickContextMenu = true;

  const DURATION = dropdown.visible ? 150 : 0;

  setDropdown({ visible: false });

  setTimeout(() => {
    setDropdown({
      visible: true,
      x: clientX,
      y: clientY,
      currentPath,
      affix
    });
    isClickContextMenu = false;
  }, DURATION);
}

watch(
  () => tab.activeTabIndex,
  () => {
    getActiveTabClientX();
  },
  {
    immediate: true
  }
);
</script>

<style scoped></style>
