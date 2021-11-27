<template>
  <div
    class="fixed flex-center top-240px right-14px z-10000 w-48px h-48px bg-primary rounded-4px cursor-pointer transition-right duration-300 ease-in-out"
    :class="{ '!right-330px': app.settingDrawer.visible }"
    @click="handleClickButton"
  >
    <icon-ic:round-close v-if="app.settingDrawer.visible" class="z-20 text-24px text-white" />
    <icon-ic-round-settings v-else class="z-20 text-24px text-white" />
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store';

const app = useAppStore();
const { openSettingDrawer, closeSettingDrawer } = useAppStore();

function handleClickButton() {
  if (app.settingDrawer.visible) {
    closeSettingDrawer();
  } else {
    openSettingDrawer();
  }
}
</script>
<style scoped></style>
