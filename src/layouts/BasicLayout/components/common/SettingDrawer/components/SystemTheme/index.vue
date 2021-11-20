<template>
  <n-divider title-placement="center">系统主题</n-divider>
  <n-grid :cols="8">
    <n-grid-item v-for="color in theme.themeColorList" :key="color">
      <color-block :color="color" :checked="color === theme.themeColor" @click="setThemeColor(color)" />
    </n-grid-item>
  </n-grid>
</template>

<script lang="ts" setup>
import { NDivider, NGrid, NGridItem } from 'naive-ui';
import { useThemeStore } from '@/store';
import { ColorBlock } from '../common';

const theme = useThemeStore();
const { setThemeColor } = useThemeStore();
</script>
<style scoped></style>
