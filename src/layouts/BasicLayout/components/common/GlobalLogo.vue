<template>
  <a :href="homePath" class="nowrap-hidden flex-center h-64px cursor-pointer">
    <img src="@/assets/img/common/logo.png" alt="" class="w-32px h-32px" />
    <h2 v-show="showTitle" class="pl-8px text-16px text-primary font-bold">{{ title }}</h2>
  </a>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useAppStore, useThemeStore } from '@/store';
import { useAppTitle } from '@/hooks';
import { EnumRoutePath } from '@/enum';

const app = useAppStore();
const theme = useThemeStore();
const title = useAppTitle();

const showTitle = computed(() => !app.menu.collapsed && theme.navStyle.mode !== 'vertical-mix');
const homePath = EnumRoutePath['dashboard-analysis'];
</script>
<style scoped></style>
