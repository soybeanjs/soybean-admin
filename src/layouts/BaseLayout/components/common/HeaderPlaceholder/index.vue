<template>
  <div v-if="theme.fixedHeaderAndTab" :style="{ height: headerAndMultiTabHeight }"></div>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/store';
import { useLayoutConfig } from '@/composables';

const theme = useThemeStore();
const { headerAndMultiTabHeight } = useLayoutConfig();
</script>
<style scoped></style>
