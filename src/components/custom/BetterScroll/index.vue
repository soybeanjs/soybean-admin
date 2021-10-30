<template>
  <div ref="scrollbar" class="w-full h-full text-left">
    <div ref="scrollbarContent" class="inline-block" :class="{ 'h-full': !options.scrollY }">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { PropType } from 'vue';
import BScroll from '@better-scroll/core';
import type { Options } from '@better-scroll/core';
import { useElementSize } from '@vueuse/core';

const props = defineProps({
  options: {
    type: Object as PropType<Options>,
    required: true
  }
});

const scrollbar = ref<HTMLElement | null>(null);
const bsInstance = ref<BScroll | null>(null);
const scrollbarContent = ref<HTMLElement | null>(null);

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
</script>
<style scoped></style>
