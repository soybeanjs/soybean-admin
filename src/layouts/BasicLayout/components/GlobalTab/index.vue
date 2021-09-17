<template>
  <div v-if="fixedHeaderAndTab && theme.navStyle.mode !== 'horizontal-mix'" class="multi-tab-height w-full"></div>
  <div
    class="multi-tab-height flex-y-center w-full px-10px"
    :class="{ 'multi-tab-top absolute': fixedHeaderAndTab, 'bg-[#f5f7f9]': !theme.darkMode }"
    :style="{ zIndex }"
  >
    <n-space :align="'center'">
      <n-tag>爱在西元前</n-tag>
      <n-tag type="success">不该</n-tag>
      <n-tag type="warning">超人不会飞</n-tag>
      <n-tag type="error">手写的从前</n-tag>
      <n-tag type="info">哪里都是你</n-tag>
      <n-gradient-text size="24">这是MultiTab组件</n-gradient-text>
    </n-space>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { NSpace, NTag, NGradientText } from 'naive-ui';
import { useThemeStore } from '@/store';

defineProps({
  zIndex: {
    type: Number,
    default: 0
  }
});

const theme = useThemeStore();

const fixedHeaderAndTab = computed(() => theme.fixedHeaderAndTab || theme.navStyle.mode === 'horizontal-mix');
const multiTabHeight = computed(() => {
  const { height } = theme.multiTabStyle;
  return `${height}px`;
});
const headerHeight = computed(() => {
  const { height } = theme.headerStyle;
  return `${height}px`;
});
</script>
<style scoped>
.multi-tab-height {
  height: v-bind(multiTabHeight);
}
.multi-tab-top {
  top: v-bind(headerHeight);
}
</style>
