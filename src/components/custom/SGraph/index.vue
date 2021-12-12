<template>
  <drag-scale-svg
    v-model:scale="dragScaleConfig.scale"
    v-model:translate="dragScaleConfig.translate"
    :scale-range="dragScaleConfig.scaleRange"
    :center-svg="centerSvg"
    :center-coord="centerCoord"
  >
    <g>
      <svg-edge
        v-for="(edge, index) in allEdges.unhighlights"
        :key="`unhighlight${index}`"
        v-bind="edge"
        :color="edgeColor"
      />
      <svg-edge
        v-for="(edge, index) in allEdges.highlights"
        :key="`highlight${index}`"
        v-bind="edge"
        :color="edgeColor"
        :highlight="true"
        :highlight-color="highlightColor"
      />
    </g>
    <g>
      <svg-node v-for="node in nodes" :key="node.id" :x="node.x" :y="node.y" :size="nodeSize">
        <slot name="node" v-bind="node"></slot>
      </svg-node>
    </g>
    <template #absolute>
      <scale-slider
        v-model:scale="dragScaleConfig.scale"
        v-model:translate="dragScaleConfig.translate"
        :theme-color="sliderColor"
        class="absolute bottom-56px transition-right duration-300 ease-in-out"
        :style="{ right: sliderRight + 'px' }"
      />
    </template>
  </drag-scale-svg>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue';
import type { SScaleRange, STranslate, SGraphNode, SGraphEdge, SNodeSize, SCoord } from '@/interface';
import { DragScaleSvg, SvgNode, SvgEdge, ScaleSlider } from './components';

interface Props {
  /** 图的节点 */
  nodes: SGraphNode[];
  /** 图的关系线 */
  edges: SGraphEdge[];
  /** 节点尺寸 */
  nodeSize?: SNodeSize;
  /** 边的填充颜色 */
  edgeColor?: string;
  /** 高亮颜色 */
  highlightColor?: string;
  /** 需要高亮关系线的节点坐标 */
  highlightCoord?: SCoord;
  /** 锁放条的颜色 */
  sliderColor?: string;
  /** 缩放条距离父元素右边的距离 */
  sliderRight?: number;
  /** 是否开启按坐标居中画布 */
  centerSvg?: boolean;
  /** 居中的坐标 */
  centerCoord?: SCoord;
}

/** 可缩放拖拽容器的配置属性 */
interface GragScaleConfig {
  /** 缩放比例 */
  scale: number;
  /** 缩放范围 */
  scaleRange: SScaleRange;
  /** g标签相对于svg标签的左上角的偏移量 */
  translate: STranslate;
}

const props = withDefaults(defineProps<Props>(), {
  nodeSize: () => ({ w: 100, h: 100 }),
  edgeColor: '#000',
  highlightColor: '#fadb14',
  highlightCoord: () => ({ x: NaN, y: NaN }),
  sliderColor: '#000',
  sliderRight: 48,
  centerSvg: false,
  centerCoord: () => ({ x: 0, y: 0 })
});

const dragScaleConfig = reactive<GragScaleConfig>({
  scale: 1,
  scaleRange: [0.2, 3],
  translate: { x: 0, y: 0 }
});

/** 区分是否高亮的边 */
const allEdges = computed(() => {
  const {
    edges,
    highlightCoord: { x: hX, y: hY },
    nodeSize: { w, h }
  } = props;
  const highlights: SGraphEdge[] = [];
  const unhighlights: SGraphEdge[] = [];
  edges.forEach(edge => {
    const { x: sX, y: sY } = edge.sourceCoord;
    const { x: tX, y: tY } = edge.targetCoord;
    const isSourceHighlight = hX === sX - w && hY + h / 2 === sY;
    const isTargetHighlight = hX === tX && hY + h / 2 === tY;
    if (isSourceHighlight || isTargetHighlight) {
      highlights.push(edge);
    } else {
      unhighlights.push(edge);
    }
  });
  return {
    highlights,
    unhighlights
  };
});
</script>
<style scoped></style>
