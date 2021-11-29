<template>
  <n-layout ref="scrollbar" :native-scrollbar="false" :content-style="scrollbarContentStyle" class="h-full">
    <n-layout-header :inverted="headerInverted" :position="headerPosition" :class="{ 'z-11': theme.fixedHeaderAndTab }">
      <global-header :show-logo="true" :show-menu-collape="false" :show-menu="true" class="relative z-2" />
      <global-tab v-if="theme.multiTabStyle.visible" />
    </n-layout-header>
    <space-placeholder />
    <global-content />
    <global-footer />
  </n-layout>
</template>

<script setup lang="ts">
import { NLayout, NLayoutHeader } from 'naive-ui';
import { useThemeStore } from '@/store';
import { useLayoutConfig } from '@/composables';
import { GlobalHeader, GlobalContent, GlobalFooter, GlobalTab, SpacePlaceholder } from '@/layouts/common';

const theme = useThemeStore();
const { headerInverted, headerPosition, scrollbarContentStyle, scrollbar } = useLayoutConfig();
</script>
<style scoped></style>
