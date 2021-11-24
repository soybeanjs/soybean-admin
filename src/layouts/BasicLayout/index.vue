<template>
  <component :is="layoutComponent[theme.navStyle.mode]" />
  <setting-drawer />
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import { useThemeStore } from '@/store';
import type { NavMode } from '@/interface';
import { VerticalLayout, VerticalMixLayout, HorizontalLayout, HorizontalMixLayout } from './components';
import { SettingDrawer } from '../common';

type LayoutComponent = {
  [key in NavMode]: Component;
};

const theme = useThemeStore();

const layoutComponent: LayoutComponent = {
  vertical: VerticalLayout,
  'vertical-mix': VerticalMixLayout,
  horizontal: HorizontalLayout,
  'horizontal-mix': HorizontalMixLayout
};
</script>
<style></style>
