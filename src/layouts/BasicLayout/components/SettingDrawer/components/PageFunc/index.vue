<template>
  <n-divider title-placement="center">界面功能</n-divider>
  <n-space vertical size="large">
    <setting-menu-item label="分割菜单">
      <n-switch :value="theme.menuStyle.splitMenu" @update:value="handleSplitMenu" />
    </setting-menu-item>
    <setting-menu-item label="固定头部">
      <n-switch :value="splitMenu" :disabled="disabledSplitMenu" @update:value="handleFixedHeader" />
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
  </n-space>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { NDivider, NSpace, NSwitch, NInputNumber } from 'naive-ui';
import { useThemeStore } from '@/store';
import { SettingMenuItem } from '../common';

const theme = useThemeStore();
const { handleSplitMenu, handleFixedHeader, handleHeaderHeight, handleMenuWidth, handleMixMenuWidth } = useThemeStore();

const disabledSplitMenu = computed(() => theme.navStyle.mode === 'horizontal-mix');
const splitMenu = computed(() => theme.headerStyle.fixed || disabledSplitMenu.value);
const disabledMenuWidth = computed(() => {
  const { mode } = theme.navStyle;
  return mode !== 'vertical' && mode !== 'horizontal-mix';
});

const disabledMixMenuWidth = computed(() => theme.navStyle.mode !== 'vertical-mix');
</script>
<style scoped></style>
