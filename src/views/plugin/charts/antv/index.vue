<script setup lang="tsx">
import { computed, onMounted, ref } from 'vue';
import type { IPointerEvent } from '@antv/g6';
import AntvFlow from './modules/antv-flow.vue';
import { getFlowDatas } from './data';

const antvFlowRef = ref();
const flowDatas = ref<any>({});
const seletedNode = ref<string | undefined>('N2');
const behaviors = [
  {
    type: 'click-select',
    enable: (event: IPointerEvent) => event.targetType === 'node',
    onClick: (event: IPointerEvent) => {
      const node = event.target as any;
      const nodeData = flowDatas.value.nodes?.find((item: any) => item.id === node.id);
      seletedNode.value = nodeData?.id;
      window.$message?.success(`选中节点：[${node?.id}]${nodeData?.name}`);
    }
  }
];
const hasNodeN = computed(() => flowDatas.value.nodes?.some((node: any) => node.id === 'NN'));

function addNode() {
  const { nodes, edges } = flowDatas.value;

  nodes.push({ id: 'NN', name: 'New node', status: 'NOT_STARTED' });
  edges.push({ id: 'EN', source: 'N5', target: 'NN' });
  flowDatas.value = { nodes, edges };
}

function removeNode(id: string) {
  const { nodes, edges } = flowDatas.value;
  // 删除node的同时，也需要删除包含NX的edge
  flowDatas.value = {
    nodes: nodes.filter((node: any) => node.id !== id),
    edges: edges.filter((edge: any) => edge.source !== id && edge.target !== id)
  };
}

onMounted(() => {
  flowDatas.value = getFlowDatas();
});
</script>

<template>
  <div class="h-full">
    <NCard title="AntV G6 Next" :bordered="false" class="h-full card-wrapper">
      <AntvFlow ref="antvFlowRef" :data="flowDatas" :selected="seletedNode" :behaviors="behaviors" />
      <NDivider />
      <NFlex>
        <NButton @click="seletedNode = 'N5'">选中节点N5(需要自行处理选中事件，不会触发元素点击)</NButton>
        <NButton v-if="!hasNodeN" @click="addNode">添加节点并与Node5连线</NButton>
        <NButton v-else @click="() => removeNode('NN')">删除新添加的节点</NButton>
        <NButton @click="() => removeNode('NX')">删除NodeX</NButton>
      </NFlex>
    </NCard>
  </div>
</template>
