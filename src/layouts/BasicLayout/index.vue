<template>
  <soybean-layout
    :mode="mode"
    :fixed-header-and-tab="theme.fixedHeaderAndTab"
    :header-height="theme.header.height"
    :tab-visible="theme.tab.visible"
    :tab-height="theme.tab.height"
    :sider-visible="siderVisible"
    :sider-width="siderWidth"
    :sider-collapsed-width="siderCollapsedWidth"
    :sider-collapse="false"
    :fixed-footer="theme.footer.fixed"
  >
    <template #header>
      <global-header />
    </template>
    <template #tab>
      <global-tab />
    </template>
    <template #sider>
      <global-sider />
    </template>
    <global-content />
    <template #footer>
      <global-footer />
    </template>
  </soybean-layout>
  <setting-drawer />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore, useThemeStore } from '@/store';
import { SoybeanLayout } from '@/package';
import { SettingDrawer, GlobalHeader, GlobalTab, GlobalSider, GlobalContent, GlobalFooter } from '../common';

const app = useAppStore();
const theme = useThemeStore();

const siderVisible = computed(() => theme.layout.mode !== 'horizontal');

type LayoutMode = 'vertical' | 'horizontal';
const mode = computed(() => {
  const vertical: LayoutMode = 'vertical';
  const horizontal: LayoutMode = 'horizontal';
  return theme.layout.mode.includes(vertical) ? vertical : horizontal;
});

const siderWidth = computed(() => {
  const { width, mixWidth, mixChildMenuWidth } = theme.sider;
  const isVerticalMix = theme.layout.mode === 'vertical-mix';
  let w = isVerticalMix ? mixWidth : width;
  if (isVerticalMix && app.mixSiderFixed) {
    w += mixChildMenuWidth;
  }
  return w;
});

const siderCollapsedWidth = computed(() => {
  const { collapsedWidth, mixCollapsedWidth, mixChildMenuWidth } = theme.sider;
  const isVerticalMix = theme.layout.mode === 'vertical-mix';
  let w = isVerticalMix ? mixCollapsedWidth : collapsedWidth;
  if (isVerticalMix && app.mixSiderFixed) {
    w += mixChildMenuWidth;
  }
  return w;
});
</script>
<style scoped></style>
