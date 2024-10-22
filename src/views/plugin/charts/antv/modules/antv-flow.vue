<script setup lang="tsx">
import { shallowRef, watch } from 'vue';
import { vResizeObserver } from '@vueuse/components';
import { useDebounceFn } from '@vueuse/core';
import type { CustomBehaviorOption } from '@antv/g6';
import type { CustomGraphData } from './antv-g6-flow';
import { useAntFlow } from './antv-g6-flow';
import { nodeStatus } from './status';

defineOptions({
  name: 'AntvFLow',
  inheritAttrs: false
});

interface Props {
  behaviors?: CustomBehaviorOption[];
  data: CustomGraphData;
  selected?: string;
  height?: string;
  autoFit?: 'view' | 'center';
}

const props = defineProps<Props>();

const containerRef = shallowRef();
const graphRef = shallowRef();

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
        <NButton @click="graphRef.zoomBy(0.9)">
          <icon-mingcute:zoom-out-line />
        </NButton>
        <NButton @click="graphRef.zoomBy(1.1)">
          <icon-mingcute:zoom-in-line />
        </NButton>
        <NButton
          @click="
            () => {
              graphRef.zoomTo(1);
              graphRef.fitCenter();
            }
          "
        >
          <icon-icon-park-outline:equal-ratio />
        </NButton>
        <NButton
          @click="
            () => {
              graphRef.fitView();
              graphRef.fitCenter();
            }
          "
        >
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
              <NGi v-for="[key, value] in Object.entries(nodeStatus)" :key="key" class="flex-center">
                <NTag size="small" round :bordered="false">
                  <template #icon>
                    <icon-f7:flag-circle-fill v-if="key === 'MILESTONE'" :style="{ color: value.color }" />
                    <icon-f7:circle-fill v-else :style="{ color: value.color }" />
                  </template>
                  {{ value.type }}
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
