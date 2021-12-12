<template>
  <g>
    <path :d="line" style="fill: none" :style="lineStyle"></path>
    <path :d="arrow" style="stroke-width: 0" :style="arrowStyle"></path>
  </g>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { SCoord } from '@/interface';

interface Props {
  /** 边的起始坐标 */
  sourceCoord: SCoord;
  /** 边的终点坐标 */
  targetCoord: SCoord;
  /** 边的线宽 */
  width?: number;
  /** 填充颜色 */
  color?: string;
  /** 是否高亮 */
  highlight?: boolean;
  /** 高亮的颜色 */
  highlightColor?: string;
  /** 是否显示终点箭头 */
  showArrow?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  width: 2,
  color: '#000',
  highlight: false,
  highlightColor: '#f00',
  showArrow: true
});

const line = computed(() => {
  const {
    sourceCoord: { x: sX, y: sY },
    targetCoord: { x: tX, y: tY },
    showArrow
  } = props;
  const horizontalGap = Math.abs(sX - tX);
  const start = `M${sX} ${sY}`;
  const end = showArrow ? `${tX - 5} ${tY}` : `${tX} ${tY}`;
  const control1 = `C${sX + (horizontalGap * 2) / 3} ${sY}`;
  const control2 = `${tX - (horizontalGap * 2) / 3} ${tY}`;
  return `${start} ${control1} ${control2} ${end}`;
});

const arrow = computed(() => {
  const { x, y } = props.targetCoord;
  const M = `M${x - 10} ${y}`;
  const L1 = `L ${x - 10} ${y - 5 + 0.2472}`;
  const A1 = `A 4 4 0 0 1 ${x - 10 + 0.178885} ${y - 5 + 0.08944}`;
  const L2 = `L ${x - 0.8944} ${y - 0.4472}`;
  const A2 = `A 5 5 0 0 1 ${x - 0.8944} ${y + 0.4472}`;
  const L3 = `L ${x - 10 + 0.178885} ${y + 5 - 0.08944}`;
  const A3 = `A 4 4 0 0 1 ${x - 10} ${y + 5 - 0.2472}`;
  return `${M} ${L1} ${A1} ${L2} ${A2} ${L3} ${A3}`;
});

const lineStyle = computed(() => {
  const { highlight, highlightColor, color } = props;
  const stroke = highlight ? highlightColor : color;
  return {
    stroke,
    strokeWidth: props.width
  };
});

const arrowStyle = computed(() => {
  const { highlight, highlightColor, color } = props;
  const fill = highlight ? highlightColor : color;
  return {
    fill
  };
});
</script>
<style scoped></style>
