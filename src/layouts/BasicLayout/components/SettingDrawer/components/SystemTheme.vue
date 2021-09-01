<template>
  <n-divider title-placement="center">系统主题</n-divider>
  <div class="flex flex-wrap justify-between">
    <div
      v-for="color in app.themeSettings.themeColorList"
      :key="color"
      class="flex-center w-20px h-20px mx-6px mb-8px cursor-pointer rounded-2px"
      :style="{ backgroundColor: color }"
      @click="setThemeColor(color)"
    >
      <icon-ic-outline-check v-if="color === app.themeSettings.themeColor" class="text-14px text-white" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NDivider } from 'naive-ui';
import { useAppStore } from '@/store';

const app = useAppStore();
const { setThemeColor } = useAppStore();
</script>
<style scoped></style>
