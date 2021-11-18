<template>
  <a
    href="/"
    class="
      flex-center
      nowrap-hidden
      bg-light
      dark:bg-dark
      transition-background-color
      duration-300
      ease-in-out
      cursor-pointer
    "
  >
    <system-logo class="w-32px h-32px" :color="theme.themeColor" />
    <h2 v-show="showTitle" class="text-primary pl-8px text-16px font-bold">{{ title }}</h2>
  </a>
</template>

<script lang="ts" setup>
import { SystemLogo } from '@/components';
import { useThemeStore } from '@/store';
import { useAppTitle } from '@/hooks';

interface Props {
  /** 显示名字 */
  showTitle: boolean;
}

defineProps<Props>();

const theme = useThemeStore();
const title = useAppTitle();
</script>
<style scoped></style>
