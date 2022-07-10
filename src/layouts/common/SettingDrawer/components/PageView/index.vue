<template>
  <n-divider title-placement="center">界面显示</n-divider>
  <n-space vertical size="large">
    <setting-menu label="面包屑">
      <n-switch :value="theme.header.crumb.visible" @update:value="theme.setHeaderCrumbVisible" />
    </setting-menu>
    <setting-menu label="面包屑图标">
      <n-switch :value="theme.header.crumb.showIcon" @update:value="theme.setHeaderCrumbIconVisible" />
    </setting-menu>
    <setting-menu label="多页签">
      <n-switch :value="theme.tab.visible" @update:value="theme.setTabVisible" />
    </setting-menu>
    <setting-menu label="多页签风格">
      <n-select
        class="w-120px"
        size="small"
        :value="theme.tab.mode"
        :options="theme.tab.modeList"
        @update:value="theme.setTabMode"
      />
    </setting-menu>
    <setting-menu label="页面切换动画">
      <n-switch :value="theme.page.animate" @update:value="theme.setPageIsAnimate" />
    </setting-menu>
    <setting-menu label="页面切换动画类型">
      <n-select
        class="w-120px"
        size="small"
        :value="theme.page.animateMode"
        :options="theme.page.animateModeList"
        @update:value="theme.setPageAnimateMode"
      />
    </setting-menu>
  </n-space>
</template>

<script lang="ts" setup>
import { useThemeStore } from '@/store';
import SettingMenu from '../SettingMenu/index.vue';

defineOptions({ name: 'PageView' });

const theme = useThemeStore();
</script>

<style scoped></style>
