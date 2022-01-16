<template>
  <app-provider>
    <router-view />
  </app-provider>
</template>

<script setup lang="ts">
import { subscribeStore } from '@/store';
import { useTheme } from '@/composables';
import AppProvider from './AppProvider.vue';

function init() {
  subscribeStore();
  useTheme();
}

init();
</script>
<style scoped></style>
