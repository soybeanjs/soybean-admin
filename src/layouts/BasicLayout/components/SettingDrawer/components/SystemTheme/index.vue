<template>
  <n-divider title-placement="center">系统主题</n-divider>
  <n-grid :cols="8">
    <n-grid-item v-for="color in app.themeSettings.themeColorList" :key="color">
      <color-block :color="color" :checked="color === app.themeSettings.themeColor" @click="setThemeColor(color)" />
    </n-grid-item>
  </n-grid>
</template>

<script lang="ts" setup>
import { NDivider, NGrid, NGridItem } from 'naive-ui';
import { useAppStore } from '@/store';
import { ColorBlock } from '@/components';

const app = useAppStore();
const { setThemeColor } = useAppStore();
</script>
<style scoped></style>
