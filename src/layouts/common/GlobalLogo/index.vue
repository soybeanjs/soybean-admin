<template>
  <a href="/" class="flex-center w-full nowrap-hidden cursor-pointer" :style="{ height: headerHeight }">
    <system-logo class="w-32px h-32px" :color="theme.themeColor" />
    <h2 v-show="showTitle" class="text-primary pl-8px text-16px font-bold">{{ title }}</h2>
  </a>
</template>

<script lang="ts" setup>
import { SystemLogo } from '@/components';
import { useThemeStore } from '@/store';
import { useAppInfo, useLayoutConfig } from '@/composables';

interface Props {
  /** 显示名字 */
  showTitle: boolean;
}

defineProps<Props>();

const theme = useThemeStore();
const { title } = useAppInfo();
const { headerHeight } = useLayoutConfig();
</script>
<style scoped></style>
