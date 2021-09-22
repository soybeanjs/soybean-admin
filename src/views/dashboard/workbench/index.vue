<template>
  <div class="bg-white">
    <n-spin class="flex-y-center flex-col" :show="loading">
      <n-gradient-text type="primary" size="32">工作台</n-gradient-text>
      <n-space>
        <n-button>Default</n-button>
        <n-button type="primary">Primary</n-button>
        <n-button type="info">Info</n-button>
        <n-button type="success">Success</n-button>
        <n-button type="warning">Warning</n-button>
        <n-button type="error">Error</n-button>
      </n-space>
    </n-spin>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { NGradientText, NSpace, NButton, NSpin } from 'naive-ui';

const loading = ref(true);

setTimeout(() => {
  loading.value = false;
}, 1500);
</script>
<style scoped></style>
