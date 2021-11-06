<template>
  <div class="h-full" :class="{ 'sider-padding': theme.navStyle.mode === 'horizontal-mix' }">
    <default-sider v-if="theme.navStyle.mode !== 'vertical-mix'" class="global-sider sider-z-index h-full" />
    <vertical-mix-sider v-else class="global-sider sider-z-index relative h-full" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useThemeStore } from '@/store';
import { DefaultSider, VerticalMixSider } from './components';

interface Props {
  /** 层级z-index */
  zIndex?: number;
}

const props = withDefaults(defineProps<Props>(), {
  zIndex: 0
});

const theme = useThemeStore();

const classZIndex = computed(() => props.zIndex);
const headerHeight = computed(() => {
  const { height } = theme.headerStyle;
  return `${height}px`;
});
</script>
<style scoped>
.global-sider {
  transition: all 0.2s ease-in-out;
  box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
}

.sider-z-index {
  z-index: v-bind(classZIndex) !important;
}

.sider-padding {
  padding-top: v-bind(headerHeight);
}
</style>
