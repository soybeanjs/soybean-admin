<template>
  <div class="h-full">
    <n-card title="文本复制" class="h-full shadow-sm rounded-16px">
      <n-input-group>
        <n-input v-model:value="source" placeholder="请输入要复制的内容吧" />
        <n-button type="primary" @click="handleCopy">复制</n-button>
      </n-input-group>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useClipboard } from '@vueuse/core';

const source = ref('');
const { copy, isSupported } = useClipboard();

function handleCopy() {
  if (!isSupported) {
    window.$message?.error('您的浏览器不支持Clipboard API');
    return;
  }
  if (!source.value) {
    window.$message?.error('请输入要复制的内容');
    return;
  }
  copy(source.value);
  window.$message?.success(`复制成功：${source.value}`);
}
</script>

<style scoped></style>
