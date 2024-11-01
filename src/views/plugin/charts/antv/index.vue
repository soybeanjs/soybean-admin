<script setup lang="tsx">
import { computed, onMounted, ref, useTemplateRef } from 'vue';
import type { Ref } from 'vue';
import type { CustomBehaviorOption, IPointerEvent } from '@antv/g6';
import AntvFlow from './modules/antv-flow.vue';
import type { CustomGraphData } from './modules/types';
import { getFlowData } from './data';

const antvFlowRef = useTemplateRef('antvFlowRef');

const flowData = ref({
  nodes: [],
  edges: []
}) as Ref<CustomGraphData>;

const selectedNode = ref<string | undefined>('N2');

const behaviors: CustomBehaviorOption[] = [
  {
    type: 'click-select',
    enable: (event: IPointerEvent) => event.targetType === 'node',
    onClick: (event: IPointerEvent) => {
      const node = event.target as unknown as HTMLElement;
      const nodeData = flowData.value.nodes.find(item => item.id === node.id);
      selectedNode.value = nodeData?.id;
      window.$message?.success(`选中节点：[${node.id}]${nodeData?.name}`);
    }
  }
];
const hasNodeN = computed(() => flowData.value.nodes.some(node => node.id === 'NN'));

function addNode() {
  const { nodes, edges } = flowData.value;

  nodes.push({ id: 'NN', name: 'New node', status: 'NOT_STARTED' });
  edges.push({ id: 'EN', source: 'N5', target: 'NN' });
  flowData.value = { nodes, edges };
}

function removeNode(id: string) {
  const { nodes, edges } = flowData.value;
  // 删除node的同时，也需要删除包含NX的edge
  flowData.value = {
    nodes: nodes.filter(node => node.id !== id),
    edges: edges.filter(edge => edge.source !== id && edge.target !== id)
  };
}

onMounted(() => {
  flowData.value = getFlowData();
});
</script>

<template>
  <div class="h-full">
    <NCard title="AntV G6 Next" :bordered="false" class="h-full card-wrapper">
      <AntvFlow ref="antvFlowRef" :data="flowData" :selected="selectedNode" :behaviors="behaviors" />
      <NDivider />
      <NFlex>
        <NButton @click="selectedNode = 'N5'">选中节点N5(需要自行处理选中事件，不会触发元素点击)</NButton>
        <NButton v-if="!hasNodeN" @click="addNode">添加节点并与Node5连线</NButton>
        <NButton v-else @click="() => removeNode('NN')">删除新添加的节点</NButton>
        <NButton @click="() => removeNode('NX')">删除NodeX</NButton>
      </NFlex>
    </NCard>
  </div>
</template>
