<template>
  <n-button
    type="primary"
    :class="[{ '!right-330px': app.settingDrawerVisible }, app.settingDrawerVisible ? 'ease-out' : 'ease-in']"
    class="fixed top-360px right-14px z-10000 w-42px h-42px !p-0 transition-all duration-300"
    @click="app.toggleSettingDrawerVisible"
  >
    <icon-ant-design-close-outlined v-if="app.settingDrawerVisible" class="text-24px" />
    <icon-ant-design-setting-outlined v-else class="text-24px" />
  </n-button>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store';

defineOptions({ name: 'DrawerButton' });

const app = useAppStore();
</script>

<style scoped></style>
