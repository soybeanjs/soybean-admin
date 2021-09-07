<template>
  <n-divider title-placement="center">界面显示</n-divider>
  <n-space vertical size="large">
    <setting-menu-item label="面包屑">
      <n-switch :value="theme.crumbsStyle.visible" @update:value="handleCrumbsVisible" />
    </setting-menu-item>
    <setting-menu-item label="面包屑图标">
      <n-switch :value="theme.crumbsStyle.showIcon" @update:value="handleCrumbsIconVisible" />
    </setting-menu-item>
    <setting-menu-item label="多标签">
      <n-switch :value="theme.multiTabStyle.visible" @update:value="handleMultiTabVisible" />
    </setting-menu-item>
    <setting-menu-item label="页面切换动画">
      <n-switch :value="theme.pageStyle.animate" @update:value="handlePageAnimate" />
    </setting-menu-item>
    <setting-menu-item label="页面切换动画类型">
      <n-select
        class="w-120px"
        size="small"
        :value="theme.pageStyle.animateType"
        :options="theme.pageStyle.animateTypeList"
        @update:value="handlePageAnimateType"
      />
    </setting-menu-item>
  </n-space>
</template>

<script lang="ts" setup>
import { NDivider, NSpace, NSwitch, NSelect } from 'naive-ui';
import { useThemeStore } from '@/store';
import { SettingMenuItem } from '../common';

const theme = useThemeStore();
const {
  handleCrumbsVisible,
  handleCrumbsIconVisible,
  handleMultiTabVisible,
  handlePageAnimate,
  handlePageAnimateType
} = useThemeStore();
</script>
<style scoped></style>
