<script setup lang="ts">
import { onMounted, shallowRef, useTemplateRef, watch } from 'vue';
import { useDebounceFn, useElementSize } from '@vueuse/core';
import type { CustomBehaviorOption, Graph } from '@antv/g6';
import { SButton, SIcon, SPopover } from '@vean/ui';
import { useAntFlow } from './antv-g6-flow';
import type { AntFlowPalette } from './antv-g6-flow';
import { nodeStatus } from './status';
import type { CustomGraphData } from './types';

/**
 * G6 画布容器（P4-01，v2 `modules/antv-flow.vue` 的移植）。
 *
 * 与 v2 的差异：
 * - `vResizeObserver` 来自 `@vueuse/components`（v3 未安装）→ 改用
 *   `useElementSize` + `watch`；
 * - 画布不再用固定 `id="antv-flow"`（一个页面放两个实例就撞 id 了）→ 直接把
 *   `containerRef` 的元素交给 G6；
 * - 工具条与图例从 naive-ui 换成 `@vean/ui`（`SButton` / `SPopover` / `SIcon`），
 *   图标用 iconify 名而不再是 `icon-*` 组件语法；
 * - v2 的 `try {} catch {}` 空捕获换成「元素不在图里就不设选中态」的显式判断；
 * - 主题色由 `palette` 传入（G6 需要具体颜色字符串，不是 CSS 变量）。
 */
interface Props {
  data: CustomGraphData;
  /** 主色 / 危险色的解析结果 + 明暗标记 */
  palette: AntFlowPalette;
  selected?: string;
  height?: string;
  behaviors?: CustomBehaviorOption[];
  autoFit?: 'view' | 'center';
}

defineOptions({ name: 'AntvFlow' });

const props = defineProps<Props>();

const containerRef = useTemplateRef<HTMLElement>('containerRef');
const graphRef = shallowRef<Graph | null>(null);

const { width: containerWidth, height: containerHeight } = useElementSize(containerRef);

/** 尺寸变化只调 `resize()`，不重建图（重建会丢缩放与选中态） */
const onContainerResize = useDebounceFn(() => {
  graphRef.value?.resize();
}, 5);

watch([containerWidth, containerHeight], onContainerResize);

async function draw() {
  const container = containerRef.value;

  if (!container) return;

  graphRef.value?.destroy();

  const { graph } = useAntFlow({
    container,
    data: props.data,
    palette: props.palette,
    behaviors: props.behaviors,
    autoFit: props.autoFit
  });

  graphRef.value = graph;

  await selectNode();
}

async function selectNode() {
  const selected = props.selected;
  const graph = graphRef.value;

  if (!selected || !graph) return;

  // 节点可能已经被删掉（比如 NX），G6 对未知 id 会抛错 —— 先确认存在
  if (!props.data.nodes.some(node => node.id === selected)) return;

  await graph.setElementState(selected, 'selected');
}

function zoomOut() {
  graphRef.value?.zoomBy(0.9);
}

function zoomIn() {
  graphRef.value?.zoomBy(1.1);
}

function resetZoom() {
  graphRef.value?.zoomTo(1);
  graphRef.value?.fitCenter();
}

function fitZoom() {
  graphRef.value?.fitView();
  graphRef.value?.fitCenter();
}

function preventContextMenu() {
  return false;
}

onMounted(() => {
  void draw();
});

watch(
  [() => props.data, () => props.selected],
  () => {
    void draw();
  },
  { deep: true }
);

defineExpose({ selectNode, graph: graphRef });
</script>

<template>
  <div class="relative">
    <div class="absolute inset-x-0 z-1 flex items-stretch justify-between">
      <div class="flex">
        <SButton size="sm" variant="outline" class="rounded-r-none" @click="zoomOut">
          <SIcon icon="mingcute:zoom-out-line" />
        </SButton>
        <SButton size="sm" variant="outline" class="rounded-l-none" @click="zoomIn">
          <SIcon icon="mingcute:zoom-in-line" />
        </SButton>
        <SButton size="sm" variant="outline" class="ml-2 rounded-r-none" @click="resetZoom">
          <SIcon icon="icon-park-outline:equal-ratio" />
        </SButton>
        <SButton size="sm" variant="outline" class="rounded-l-none" @click="fitZoom">
          <SIcon icon="ph:arrows-out" />
        </SButton>
      </div>

      <SPopover placement="bottom-end">
        <template #trigger>
          <SButton size="sm" variant="outline">
            <SIcon icon="ph:question" />
          </SButton>
        </template>
        <div class="flex w-45 flex-col gap-2">
          <div class="text-xs font-bold">节点图例</div>
          <div class="grid grid-cols-2 gap-2">
            <div v-for="(config, status) in nodeStatus" :key="status" class="flex items-center gap-1">
              <SIcon
                :icon="status === 'MILESTONE' ? 'mdi:flag-circle' : 'mdi:circle'"
                :style="{ color: config.color }"
                class="shrink-0"
              />
              <span class="truncate text-xs">{{ config.type }}</span>
            </div>
          </div>
        </div>
      </SPopover>
    </div>

    <div
      ref="containerRef"
      class="w-full"
      :style="{ height: props.height || '300px' }"
      @contextmenu="preventContextMenu"
    />
  </div>
</template>
