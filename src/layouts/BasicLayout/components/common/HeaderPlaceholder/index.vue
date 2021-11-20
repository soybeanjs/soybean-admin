<template>
  <div v-if="theme.fixedHeaderAndTab" :style="{ height: headerAndMultiTabHeight }"></div>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/store';
import { useLayoutConfig } from '@/composables';

interface Props {
  /** 去除tab的高度 */
  removeTab?: boolean;
}

withDefaults(defineProps<Props>(), {
  removeTab: false
});

const theme = useThemeStore();
const { headerAndMultiTabHeight } = useLayoutConfig();
</script>
<style scoped></style>
