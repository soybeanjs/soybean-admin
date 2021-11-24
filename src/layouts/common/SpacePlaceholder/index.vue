<template>
  <div v-if="theme.fixedHeaderAndTab" class="space-placholder_height"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useThemeStore } from '@/store';

interface Props {
  /** 去除tab的高度 */
  removeHeader?: boolean;
  /** 去除tab的高度 */
  removeTab?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  removeHeader: false,
  removeTab: false
});

const theme = useThemeStore();
const spaceHeight = computed(() => {
  const {
    multiTabStyle: { visible, height: tabHeight },
    headerStyle: { height: headerHeight }
  } = theme;
  let height = 0;
  if (!props.removeHeader) {
    height += headerHeight;
  }
  if (!props.removeTab && visible) {
    height += tabHeight;
  }
  return `${height}px`;
});
</script>
<style scoped>
.space-placholder_height {
  height: v-bind(spaceHeight);
}
</style>
