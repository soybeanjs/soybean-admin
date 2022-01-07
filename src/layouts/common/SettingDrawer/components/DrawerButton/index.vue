<template>
  <n-button
    class="fixed top-240px right-14px z-10000"
    :class="{ '!right-330px': app.settingDrawerVisible }"
    @click="toggleSettingdrawerVisible"
  >
    点击
  </n-button>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui';
import { useAppStore } from '@/store';

const app = useAppStore();
const { toggleSettingdrawerVisible } = useAppStore();
</script>
<style scoped></style>
