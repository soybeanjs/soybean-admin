<template>
  <div ref="mousewheelRef" class="h-full cursor-move">
    <svg ref="svgRef" class="w-full h-full select-none" @mousedown="dragStart">
      <g :style="{ transform }">
        <slot></slot>
      </g>
    </svg>
    <slot name="absolute"></slot>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import type { SScaleRange, STranslate, SPosition, SCoord, SNodeSize } from '@/interface';

interface Props {
  /** 缩放比例 */
  scale?: number;
  /** 缩放范围 */
  scaleRange?: SScaleRange;
  /** g标签相对于svg标签的左上角的偏移量 */
  translate?: STranslate;
  /** 节点尺寸 */
  nodeSize?: SNodeSize;
  /** 是否开启按坐标居中画布 */
  centerSvg?: boolean;
  /** 居中的坐标 */
  centerCoord?: SCoord;
}

interface Emits {
  (e: 'update:scale', scale: number): void;
  (e: 'update:translate', translate: STranslate): void;
}

interface SvgConfig {
  /** 距离可视区左边的距离 */
  left: number;
  /** 距离可视区顶部的距离 */
  top: number;
  /** svg画布宽 */
  width: number;
  /** svg画布高 */
  height: number;
}

interface DragScale {
  /** 画布缩放比例 */
  scale: number;
  /** 画布缩放比例取值范围 */
  scaleRange: SScaleRange;
  /** 画布移动距离 */
  translate: STranslate;
  /** 是否在拖动 */
  isDragging: boolean;
  /** 拖动前的鼠标距离可视区左边和上边的距离 */
  lastPosition: SPosition;
  /** svg的属性 */
  svgConfig: SvgConfig;
}

interface WheelDelta {
  wheelDelta: number;
  wheelDeltaX: number;
  wheelDeltaY: number;
}

type DOMWheelEvent = WheelEvent & WheelDelta;

type WheelDirection = 'up' | 'down';

const props = withDefaults(defineProps<Props>(), {
  scale: 1,
  scaleRange: () => [0.2, 3],
  translate: () => ({ x: 0, y: 0 }),
  nodeSize: () => ({ w: 100, h: 100 }),
  centerSvg: false,
  centerCoord: () => ({ x: 0, y: 0 })
});

const emit = defineEmits<Emits>();

/** 最外层容器，用于鼠标滚轮事件 */
const mousewheelRef = ref<HTMLElement>();

/** 基本属性 */
const dragScale = reactive<DragScale>({
  scale: props.scale,
  scaleRange: [...props.scaleRange],
  translate: { ...props.translate },
  isDragging: false,
  lastPosition: {
    x: 0,
    y: 0
  },
  svgConfig: {
    left: 0,
    top: 0,
    width: 1000,
    height: 500
  }
});
function setDragScale(data: Partial<DragScale>) {
  Object.assign(dragScale, data);
}

/** svg dom */
const svgRef = ref<SVGElement | null>(null);
function initSvgConfig() {
  if (svgRef.value) {
    const { left, top, width, height } = svgRef.value.getBoundingClientRect();
    setDragScale({ svgConfig: { left, top, width, height } });
  }
}

/** 缩放和平移样式 */
const transform = computed(() => {
  const { scale, translate } = dragScale;
  const { x, y } = translate;
  return `translate(${x}px, ${y}px) scale(${scale})`;
});

/**
 * 更新偏移量
 * @param delta - 偏移量的增量
 */
function updateTranslate(delta: STranslate) {
  const { x, y } = dragScale.translate;
  const update = { x: x + delta.x, y: y + delta.y };
  setDragScale({ translate: update });
}

/**
 * 缩放后将视图移动到鼠标的位置
 * @param mouseX - 鼠标x坐标
 * @param mouseY - 鼠标y坐标
 * @param oldScale - 缩放前的缩放比例
 */
function correctTranslate(mouseX: number, mouseY: number, oldScale: number) {
  const { scale, translate } = dragScale;
  const { x, y } = translate;
  const sourceCoord = {
    x: (mouseX - x) / oldScale,
    y: (mouseY - y) / oldScale
  };
  const sourceTranslate = {
    x: sourceCoord.x * (1 - scale),
    y: sourceCoord.y * (1 - scale)
  };
  const update = {
    x: sourceTranslate.x - (sourceCoord.x - mouseX),
    y: sourceTranslate.y - (sourceCoord.y - mouseY)
  };
  setDragScale({ translate: update });
}

// 拖拽事件
/** 拖拽开始 */
function dragStart(e: MouseEvent) {
  if (e.button !== 0) {
    // 只允许鼠标点击左键拖动
    return;
  }
  const { clientX: x, clientY: y } = e;
  setDragScale({ isDragging: true, lastPosition: { x, y } });
}
/** 拖拽中 */
function dragMove(e: MouseEvent) {
  if (dragScale.isDragging) {
    const { clientX: x, clientY: y } = e; // 当前鼠标的位置
    const { x: lX, y: lY } = dragScale.lastPosition; // 上一次鼠标的位置
    const delta = { x: x - lX, y: y - lY }; // 鼠标的偏移量
    updateTranslate(delta);
    setDragScale({ lastPosition: { x, y } });
  }
}
/** 拖拽结束 */
function dragEnd() {
  setDragScale({ isDragging: false });
}

/** 缩放事件 */
function handleScale(e: WheelEvent, direction: WheelDirection) {
  const { clientX, clientY } = e;
  const { left, top } = dragScale.svgConfig;
  const mouseX = clientX - left;
  const mouseY = clientY - top;
  const { scale: oldScale, scaleRange } = dragScale;
  const [min, max] = scaleRange;
  const scaleParam = 0.045;
  const updateParam = direction === 'up' ? 1 + scaleParam : 1 - scaleParam;
  const newScale = oldScale * updateParam;
  if (newScale >= min && newScale <= max) {
    dragScale.scale = newScale;
  } else {
    dragScale.scale = newScale < min ? min : max;
  }
  correctTranslate(mouseX, mouseY, oldScale);
}
/** 鼠标滚轮缩放事件 */
function handleMousewheel(e: WheelEvent) {
  e.preventDefault();
  const direction: WheelDirection = (e as DOMWheelEvent).wheelDeltaY > 0 ? 'up' : 'down';
  handleScale(e, direction);
}

/** 监听拖拽事件 */
function initDragEventListener() {
  window.addEventListener('mousemove', dragMove);
  window.addEventListener('mouseup', dragEnd);
}

/** 监听鼠标滚轮事件 */
function initMousewheelEventListener() {
  if (mousewheelRef.value) {
    mousewheelRef.value.addEventListener('wheel', handleMousewheel);
  }
}

/** 卸载监听事件 */
function destroyEventListener() {
  window.removeEventListener('mousemove', dragMove);
  window.removeEventListener('mouseup', dragEnd);
  if (mousewheelRef.value) {
    mousewheelRef.value.removeEventListener('wheel', handleMousewheel);
  }
}

// 根据指定坐标居中布局
function handleCenterSvg() {
  const { x, y } = props.centerCoord;
  const isCoordValid = !Number.isNaN(x) && !Number.isNaN(y);
  if (props.centerSvg && isCoordValid) {
    const { w, h } = props.nodeSize;
    const { width, height } = dragScale.svgConfig;
    const translate = { x: width / 2 - x - w / 2, y: height / 2 - y - h / 2 };
    setDragScale({ translate });
  } else {
    setDragScale({ translate: { x: 0, y: 0 } });
  }
}

// 将scale和translate进行双向数据绑定
watch(
  () => props.scale,
  newValue => {
    setDragScale({ scale: newValue });
  }
);
watch(
  () => props.translate,
  newValue => {
    setDragScale({ translate: newValue });
  }
);
watch(
  () => dragScale.scale,
  newValue => {
    emit('update:scale', newValue);
  }
);
watch(
  () => dragScale.translate,
  newValue => {
    emit('update:translate', newValue);
  }
);
// 监听centerCoord，居中画布
watch([() => props.centerSvg, () => props.centerCoord], () => {
  handleCenterSvg();
});

/** 初始化 */
function init() {
  initDragEventListener();
  initMousewheelEventListener();
  initSvgConfig();
  handleCenterSvg();
}

onMounted(() => {
  init();
});

// 卸载监听事件
onBeforeUnmount(() => {
  destroyEventListener();
});
</script>
<style scoped></style>
