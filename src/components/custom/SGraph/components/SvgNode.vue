<template>
  <g :transform="transform">
    <foreignObject :width="props.size.w" :height="props.size.h">
      <slot></slot>
    </foreignObject>
  </g>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { SNodeSize } from '@/interface';

interface Props {
  /** 节点尺寸 */
  size?: SNodeSize;
  /** 节点坐标 */
  x: number;
  /** 节点坐标 */
  y: number;
}

const props = withDefaults(defineProps<Props>(), {
  size: () => ({ w: 100, h: 100 })
});

const transform = computed(() => `translate(${props.x}, ${props.y})`);
</script>
<style scoped></style>
