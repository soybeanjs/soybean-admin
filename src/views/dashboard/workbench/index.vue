<template>
  <div class="p-10px">
    <div class="flex-y-center flex-col h-500px bg-white">
      <n-gradient-text type="primary" size="32">工作台</n-gradient-text>
      <n-space>
        <n-button>Default</n-button>
        <n-button type="primary">Primary</n-button>
        <n-button type="info">Info</n-button>
        <n-button type="success">Success</n-button>
        <n-button type="warning">Warning</n-button>
        <n-button type="error">Error</n-button>
      </n-space>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NGradientText, NSpace, NButton } from 'naive-ui';
</script>
<style scoped></style>
