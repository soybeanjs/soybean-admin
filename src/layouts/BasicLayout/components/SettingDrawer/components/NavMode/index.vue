<template>
  <n-divider title-placement="center">导航栏模式</n-divider>
  <n-space justify="space-between">
    <nav-type
      v-for="item in modeList"
      :key="item.mode"
      :mode="item.mode"
      :checked="theme.navStyle.mode === item.mode"
      :primary-color="theme.themeColor"
      @click="setNavMode(item.mode)"
    />
  </n-space>
</template>

<script lang="ts" setup>
import { NDivider, NSpace } from 'naive-ui';
import { EnumNavMode } from '@/enum';
import type { NavMode } from '@/interface';
import { NavType } from './components';
import { useThemeStore } from '@/store';

interface ModeList {
  mode: NavMode;
  label: string;
}

const theme = useThemeStore();
const { setNavMode } = useThemeStore();

const modeList: ModeList[] = [
  { mode: 'vertical', label: EnumNavMode.vertical },
  { mode: 'vertical-mix', label: EnumNavMode['vertical-mix'] },
  { mode: 'horizontal', label: EnumNavMode.horizontal },
  { mode: 'horizontal-mix', label: EnumNavMode['horizontal-mix'] }
];
</script>
<style scoped></style>
