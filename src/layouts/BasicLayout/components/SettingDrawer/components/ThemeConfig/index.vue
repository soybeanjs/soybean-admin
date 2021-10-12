<template>
  <n-divider title-placement="center">主题配置</n-divider>
  <n-space vertical>
    <n-button ref="copyRef" type="primary" :block="true">拷贝当前配置</n-button>
    <n-button ref="resetRef" type="warning" :block="true">重置当前配置</n-button>
  </n-space>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { NDivider, NSpace, NButton } from 'naive-ui';
// import Clipboard from 'clipboard';
// import { useThemeStore } from '@/store';

// const theme = useThemeStore();
const copyRef = ref<HTMLElement | null>(null);
const resetRef = ref<HTMLElement | null>(null);

// function handleSuccess() {
//   window.$dialog?.success({
//     title: '操作成功',
//     content: '复制成功,请替换 src/settings/theme.json的内容！',
//     positiveText: '确定'
//   });
// }
</script>
<style scoped></style>
