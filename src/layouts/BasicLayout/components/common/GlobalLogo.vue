<template>
  <a href="/" class="logo-height nowrap-hidden flex-center cursor-pointer">
    <img src="@/assets/img/common/logo.png" alt="" class="w-32px h-32px" />
    <h2 v-show="showTitle" class="pl-8px text-16px text-primary font-bold">{{ title }}</h2>
  </a>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useAppStore, useThemeStore } from '@/store';
import { useAppTitle } from '@/hooks';

const app = useAppStore();
const theme = useThemeStore();
const title = useAppTitle();

const showTitle = computed(
  () => !theme.isVerticalNav || (!app.menu.collapsed && theme.navStyle.mode !== 'vertical-mix')
);
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
