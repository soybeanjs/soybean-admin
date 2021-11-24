<template>
  <n-divider title-placement="center">界面功能</n-divider>
  <n-space vertical size="large">
    <setting-menu-item label="顶部菜单位置">
      <n-select
        class="w-120px"
        size="small"
        :value="theme.menuStyle.horizontalPosition"
        :options="theme.menuStyle.horizontalPositionList"
        @update:value="handleHorizontalMenuPosition"
      />
    </setting-menu-item>
    <setting-menu-item label="菜单展开宽度">
      <n-input-number
        class="w-120px"
        size="small"
        :value="theme.menuStyle.width"
        :disabled="disabledMenuWidth"
        :step="10"
        @update:value="handleMenuWidth"
      />
    </setting-menu-item>
    <setting-menu-item label="左侧混合菜单展开宽度">
      <n-input-number
        class="w-120px"
        size="small"
        :value="theme.menuStyle.mixWidth"
        :disabled="disabledMixMenuWidth"
        :step="5"
        @update:value="handleMixMenuWidth"
      />
    </setting-menu-item>
    <setting-menu-item label="固定头部和多页签">
      <n-switch :value="theme.fixedHeaderAndTab" :disabled="isHorizontalMix" @update:value="handleFixedHeaderAndTab" />
    </setting-menu-item>
    <setting-menu-item label="头部高度">
      <n-input-number
        class="w-120px"
        size="small"
        :value="theme.headerStyle.height"
        :step="1"
        @update:value="handleHeaderHeight"
      />
    </setting-menu-item>
    <setting-menu-item label="多页签高度">
      <n-input-number
        class="w-120px"
        size="small"
        :value="theme.multiTabStyle.height"
        :step="1"
        @update:value="handleMultiTabHeight"
      />
    </setting-menu-item>
    <setting-menu-item label="多页签缓存">
      <n-switch :value="theme.multiTabStyle.isCache" @update:value="handleSetMultiTabCache" />
    </setting-menu-item>
    <setting-menu-item label="清空多页签缓存">
      <n-popconfirm placement="top-end" @positive-click="handleRemoveTabRouteCache">
        <template #trigger>
          <n-button type="primary" size="small">清空</n-button>
        </template>
        确定要清空多页签缓存吗？
      </n-popconfirm>
    </setting-menu-item>
  </n-space>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { NDivider, NSpace, NSwitch, NSelect, NInputNumber, NButton, NPopconfirm, useMessage } from 'naive-ui';
import { useThemeStore, useAppStore } from '@/store';
import { clearTabRoutes } from '@/utils';
import { SettingMenuItem } from '../common';

const theme = useThemeStore();
const {
  handleHorizontalMenuPosition,
  handleFixedHeaderAndTab,
  handleHeaderHeight,
  handleMultiTabHeight,
  handleMenuWidth,
  handleMixMenuWidth,
  handleSetMultiTabCache
} = useThemeStore();
const { initMultiTab } = useAppStore();
const message = useMessage();

const isHorizontalMix = computed(() => theme.navStyle.mode === 'horizontal-mix');
const disabledMenuWidth = computed(() => {
  const { mode } = theme.navStyle;
  return mode !== 'vertical' && mode !== 'horizontal-mix';
});

const disabledMixMenuWidth = computed(() => theme.navStyle.mode !== 'vertical-mix');

function handleRemoveTabRouteCache() {
  clearTabRoutes();
  initMultiTab();
  message.success('操作成功！');
}
</script>
<style scoped></style>
