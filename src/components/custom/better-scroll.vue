<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useElementSize } from '@vueuse/core';
import BScroll from '@better-scroll/core';
import type { Options } from '@better-scroll/core';

defineOptions({ name: 'BetterScroll' });

interface Props {
  /**
   * BetterScroll options
   *
   * @link https://better-scroll.github.io/docs/zh-CN/guide/base-scroll-options.html
   */
  options: Options;
}

const props = defineProps<Props>();

const bsWrapper = ref<HTMLElement>();
const bsContent = ref<HTMLElement>();
const { width: wrapWidth } = useElementSize(bsWrapper);
const { width, height } = useElementSize(bsContent);

const instance = ref<BScroll>();
const isScrollY = computed(() => Boolean(props.options.scrollY));

function initBetterScroll() {
  if (!bsWrapper.value) return;
  instance.value = new BScroll(bsWrapper.value, props.options);
}

// refresh BS when scroll element size changed
watch([() => wrapWidth.value, () => width.value, () => height.value], () => {
  instance.value?.refresh();
});

onMounted(() => {
  initBetterScroll();
});

defineExpose({ instance });
</script>

<template>
  <div ref="bsWrapper" class="h-full text-left">
    <div ref="bsContent" class="inline-block" :class="{ 'h-full': !isScrollY }">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped></style>
