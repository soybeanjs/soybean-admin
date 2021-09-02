<template>
  <n-divider title-placement="center">系统主题</n-divider>
  <div class="flex flex-wrap justify-between">
    <color-block
      v-for="color in app.themeSettings.themeColorList"
      :key="color"
      :color="color"
      :checked="color === app.themeSettings.themeColor"
      @click="setThemeColor(color)"
    />
  </div>
</template>

<script lang="ts" setup>
import { NDivider } from 'naive-ui';
import { useAppStore } from '@/store';
import { ColorBlock } from '@/components';

const app = useAppStore();
const { setThemeColor } = useAppStore();
</script>
<style scoped></style>
