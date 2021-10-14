<template>
  <a href="/" class="logo-height nowrap-hidden flex-center cursor-pointer">
    <system-logo class="w-32px h-32px" :color="primaryColor" />
    <h2 v-show="showTitle" class="pl-8px text-16px font-bold" :style="{ color: primaryColor }">{{ title }}</h2>
  </a>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { SystemLogo } from '@/components';
import { useAppStore, useThemeStore } from '@/store';
import { useAppTitle } from '@/hooks';

const app = useAppStore();
const theme = useThemeStore();
const title = useAppTitle();

const showTitle = computed(
  () => !theme.isVerticalNav || (!app.menu.collapsed && theme.navStyle.mode !== 'vertical-mix')
);

const primaryColor = computed(() => theme.themeColor);
const headerHeight = computed(() => {
  const { height } = theme.headerStyle;
  return `${height}px`;
});
</script>
<style scoped>
.logo-height {
  height: v-bind(headerHeight);
}
</style>
