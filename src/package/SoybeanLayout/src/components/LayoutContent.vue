<template>
  <main :style="style" class="soybean-layout__main">
    <slot></slot>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  /** 顶部内边距 */
  paddingTop?: number;
  /** 底部内边距 */
  paddingBottom?: number;
  /** 左侧内边距 */
  paddingLeft?: number;
  /** 动画过渡时间 */
  transitionDuration?: number;
  /** 动画过渡时间 */
  transitionTimingFunction?: string;
}

const props = withDefaults(defineProps<Props>(), {
  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  transitionDuration: 300,
  transitionTimingFunction: 'ease-in-out'
});

const style = computed(() => {
  const { paddingTop, paddingBottom, paddingLeft, transitionDuration, transitionTimingFunction } = props;
  return `padding-top: ${paddingTop}px;padding-bottom: ${paddingBottom}px;padding-left: ${paddingLeft}px;transition-duration: ${transitionDuration}ms;transition-timing-function: ${transitionTimingFunction};`;
});
</script>
<style scoped>
.soybean-layout__main {
  flex-grow: 1;
  width: 100%;
  transition-property: padding-left;
}
</style>
