<template>
  <div ref="scrollbar" class="h-full text-left">
    <div ref="scrollbarContent" class="inline-block" :class="{ 'h-full': !isScrollY }">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import BScroll from '@better-scroll/core';
import type { Options } from '@better-scroll/core';
import { useElementSize } from '@vueuse/core';

interface Props {
  /** better-scroll的配置: https://better-scroll.github.io/docs/zh-CN/guide/base-scroll-options.html */
  options: Options;
}

const props = defineProps<Props>();

const scrollbar = ref<HTMLElement | null>(null);
const bsInstance = ref<BScroll | null>(null);
const scrollbarContent = ref<HTMLElement | null>(null);
const isScrollY = computed(() => Boolean(props.options.scrollY));

function initBetterScroll() {
  bsInstance.value = new BScroll(scrollbar.value!, props.options);
}

// 滚动元素发生变化，刷新BS
const { width, height } = useElementSize(scrollbarContent);
watch([() => width.value, () => height.value], () => {
  if (bsInstance.value) {
    bsInstance.value.refresh();
  }
});

onMounted(() => {
  initBetterScroll();
});

defineExpose({ bsInstance });
</script>
<style scoped></style>
