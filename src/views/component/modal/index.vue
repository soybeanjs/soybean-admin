<template>
  <n-card title="弹窗" class="h-full shadow-sm rounded-16px">
    <n-grid cols="s:1 m:2" responsive="screen" :x-gap="16" :y-gap="16">
      <n-grid-item>
        <n-card title="普通弹窗" class="min-h-180px">
          <n-button @click="visible = true">来吧</n-button>
          <n-modal v-model:show="visible">
            <n-card style="width: 600px" title="模态框" :bordered="false" size="huge">
              <template #header-extra>噢！</template>
              内容
              <template #footer>尾部</template>
            </n-card>
          </n-modal>
        </n-card>
      </n-grid-item>
      <n-grid-item>
        <n-card title="Hook弹窗" class="min-h-180px">
          <n-button @click="handleShow">来吧</n-button>
        </n-card>
      </n-grid-item>
    </n-grid>
  </n-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { NCard, NGrid, NGridItem, NModal, NButton } from 'naive-ui';
import { useModal } from '@/hooks';

const visible = ref(false);
const { showModal } = useModal();

function handleShow() {
  showModal({
    title: '确认',
    content: () => '111',
    maskClosable: true,
    preset: 'dialog',
    positiveText: '确认',
    bordered: false,
    onPositiveClick: () => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(111);
        }, 3000);
      });
    },
    onNegativeClick: () => {},
    negativeText: '算了'
  });
}
</script>
<style lang="scss" scoped></style>
