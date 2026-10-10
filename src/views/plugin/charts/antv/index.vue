<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import type { CustomBehaviorOption, IPointerEvent } from '@antv/g6';
import { resolveTokenColor } from '@vean/theme';
import { SButton, SCard, toast, useTheme } from '@vean/ui';
import AntvFlow from './modules/antv-flow.vue';
import type { CustomGraphData } from './modules/types';
import { getFlowData } from './data';

/**
 * AntV G6 关系图演示（P4-01，v2 `charts/antv/index.vue` 的移植）。
 *
 * 与 v2 的差异：
 * - `window.$message?.success` → `@vean/ui` 的 `toast.success`；
 * - 点击回调用 `event.target.id` 拿节点 id（v2 是
 *   `event.target as unknown as HTMLElement`，把 G6 的图形 `Element` 硬转成
 *   DOM `Element` 再读 `.id` —— 本仓禁 `as T` 断言，而且 G6 的 `Target`
 *   本来就带 `id`，不需要断言）；
 * - G6 的主题色来自 `useTheme()` + `@vean/theme` 的 `resolveTokenColor()`
 *   （G6 要具体颜色值，不能吃 CSS 变量），并跟随明暗模式重算；
 * - `ref<CustomGraphData>() as Ref<CustomGraphData>` 的双重断言 →
 *   `shallowRef<CustomGraphData>({ nodes: [], edges: [] })`。
 */
defineOptions({ name: 'PluginChartsAntv' });

const { t } = useI18n();
const { theme, effectiveMode } = useTheme();

const flowData = shallowRef<CustomGraphData>({ nodes: [], edges: [] });
const selectedNode = ref<string | undefined>('N2');

/**
 * 取 G6 图形元素的 id。
 *
 * `IPointerEvent['target']` 的类型是 `Target = Document | Element`，而 G6 的
 * `Element` 是 canvas 图形对象（不是 DOM 元素），其类型里**没有** `id` —— 但
 * 运行时每个图形都有。这里用类型守卫读，避免 `as` 断言（本仓 eslint 禁 `as T`）。
 */
function targetId(target: unknown): string | undefined {
  if (typeof target !== 'object' || target === null || !('id' in target)) return undefined;

  const id = target.id;

  return typeof id === 'string' ? id : undefined;
}

/** 明暗 + 主题名 → G6 需要的具体颜色 */
const palette = computed(() => {
  const options = theme.value;
  const mode = effectiveMode.value;

  return {
    primary: resolveTokenColor(options, 'primary', mode),
    destructive: resolveTokenColor(options, 'destructive', mode),
    dark: mode === 'dark'
  };
});

const behaviors: CustomBehaviorOption[] = [
  {
    type: 'click-select',
    enable: (event: IPointerEvent) => event.targetType === 'node',
    onClick: (event: IPointerEvent) => {
      const nodeId = targetId(event.target);
      const nodeData = flowData.value.nodes.find(item => item.id === nodeId);

      selectedNode.value = nodeData?.id;

      if (!nodeData) return;

      toast.success(`选中节点：[${nodeId}]${nodeData.name ?? ''}`);
    }
  }
];

const hasNewNode = computed(() => flowData.value.nodes.some(node => node.id === 'NN'));

function addNode() {
  flowData.value = {
    nodes: [...flowData.value.nodes, { id: 'NN', name: 'New node', status: 'NOT_STARTED' }],
    edges: [...flowData.value.edges, { id: 'EN', source: 'N5', target: 'NN' }]
  };
}

function removeNode(id: string) {
  flowData.value = {
    nodes: flowData.value.nodes.filter(node => node.id !== id),
    edges: flowData.value.edges.filter(edge => edge.source !== id && edge.target !== id)
  };

  // 选中的节点被删掉后，选中态要落到别处，否则 G6 会继续持有已销毁的元素
  if (selectedNode.value === id) {
    selectedNode.value = undefined;
  }
}

function selectN5() {
  selectedNode.value = 'N5';
}

function removeNewNode() {
  removeNode('NN');
}

function removeNodeX() {
  removeNode('NX');
}

onMounted(() => {
  flowData.value = getFlowData();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <SCard title="AntV G6">
      <AntvFlow :data="flowData" :palette="palette" :selected="selectedNode" :behaviors="behaviors" height="420px" />

      <div class="mt-4 flex flex-wrap gap-3">
        <SButton variant="outline" @click="selectN5">{{ t('plugin.graphSelectNode') }}</SButton>
        <SButton v-if="!hasNewNode" variant="outline" @click="addNode">{{ t('plugin.graphAddNode') }}</SButton>
        <SButton v-else variant="outline" @click="removeNewNode">{{ t('plugin.graphRemoveNode') }}</SButton>
        <SButton variant="outline" destructive @click="removeNodeX">删除 NodeX</SButton>
      </div>
    </SCard>
  </div>
</template>
