<template>
  <n-layout :has-sider="true" class="h-full">
    <mix-sider v-bind="globalSiderClassAndStyle" />
    <n-layout-content ref="scrollbar" :native-scrollbar="false" :content-style="scrollbarContentStyle">
      <n-layout-header
        :inverted="headerInverted"
        :position="headerPosition"
        :class="{ 'z-11': theme.fixedHeaderAndTab }"
      >
        <global-header :show-logo="false" :show-menu-collape="false" :show-menu="false" class="relative z-2" />
        <global-tab v-if="theme.multiTabStyle.visible" />
      </n-layout-header>
      <space-placeholder />
      <global-content />
      <global-footer />
    </n-layout-content>
  </n-layout>
</template>

<script setup lang="ts">
import { NLayout, NLayoutContent, NLayoutHeader } from 'naive-ui';
import { useThemeStore } from '@/store';
import { useLayoutConfig } from '@/composables';
import { MixSider, GlobalHeader, GlobalContent, GlobalFooter, GlobalTab, SpacePlaceholder } from '@/layouts/common';

const theme = useThemeStore();
const { headerInverted, headerPosition, globalSiderClassAndStyle, scrollbarContentStyle, scrollbar } =
  useLayoutConfig();
</script>
<style scoped></style>
