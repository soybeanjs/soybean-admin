<script setup lang="tsx">
import { shallowRef, useTemplateRef, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { vResizeObserver } from '@vueuse/components';
import type { CustomBehaviorOption, Graph } from '@antv/g6';
import { useAntFlow } from './antv-g6-flow';
import { nodeStatus } from './status';
import type { CustomGraphData } from './types';

defineOptions({
  name: 'AntvFLow'
});

interface Props {
  behaviors?: CustomBehaviorOption[];
  data: CustomGraphData;
  selected?: string;
  height?: string;
  autoFit?: 'view' | 'center';
}

const props = defineProps<Props>();

const containerRef = useTemplateRef('containerRef');
const graphRef = shallowRef<Graph | null>(null);

// 监听容器尺寸变化，调整画布大小为图容器大小
const onContainerResize = useDebounceFn(() => {
  if (graphRef.value) {
    graphRef.value.resize();
  }
}, 5);

async function draw() {
  if (graphRef.value) {
    graphRef.value.destroy();
  }
  const { graph } = useAntFlow({
    container: 'antv-flow',
    data: props.data,
    behaviors: props.behaviors,
    autoFit: props.autoFit
  });
  graphRef.value = graph;
  await selectNode();
}

async function selectNode() {
  if (props.selected && graphRef.value) {
    try {
      await graphRef.value.setElementState(props.selected, 'selected');
    } catch {}
  }
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

watch(
  [() => props.data, () => props.selected],
  () => {
    draw();
  },
  { deep: true }
);

defineExpose({ selectNode, graph: graphRef });
</script>

<template>
  <div class="relative">
    <!-- 画布操作栏 -->
    <div class="absolute left-0 right-0 z-1 flex items-center items-stretch justify-between">
      <NButtonGroup size="small" class="bg-white!">
        <NButton @click="zoomOut">
          <icon-mingcute:zoom-out-line />
        </NButton>
        <NButton @click="zoomIn">
          <icon-mingcute:zoom-in-line />
        </NButton>
        <NButton @click="resetZoom">
          <icon-icon-park-outline:equal-ratio />
        </NButton>
        <NButton @click="fitZoom">
          <icon-gg:ratio />
        </NButton>
      </NButtonGroup>
      <div class="flex-center gap-12px">
        <NPopover placement="bottom-end" :animated="false">
          <template #trigger>
            <NButton size="small" class="bg-white!">
              <icon-fe:question />
            </NButton>
          </template>
          <div class="flex-col gap-8px">
            <div span="2" class="text-12px font-bold">节点图例</div>
            <NGrid :cols="2" :y-gap="8" class="w-180px!">
              <NGi v-for="(config, status) in nodeStatus" :key="status" class="flex-center">
                <NTag size="small" round :bordered="false">
                  <template #icon>
                    <icon-f7:flag-circle-fill v-if="status === 'MILESTONE'" :style="{ color: config.color }" />
                    <icon-f7:circle-fill v-else :style="{ color: config.color }" />
                  </template>
                  {{ config.type }}
                </NTag>
              </NGi>
            </NGrid>
          </div>
        </NPopover>
      </div>
    </div>
    <!-- 画布 -->
    <div
      id="antv-flow"
      ref="containerRef"
      v-resize-observer="onContainerResize"
      class="w-full"
      :style="{ height: props.height || '300px' }"
      @contextmenu="event => event.preventDefault()"
    ></div>
  </div>
</template>
