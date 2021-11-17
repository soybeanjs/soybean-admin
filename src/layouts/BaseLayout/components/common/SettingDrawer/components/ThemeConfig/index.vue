<template>
  <n-divider title-placement="center">主题配置</n-divider>
  <n-space vertical>
    <div ref="copyRef" :data-clipboard-text="dataClipboardText">
      <n-button type="primary" :block="true">拷贝当前配置</n-button>
    </div>
    <n-button type="warning" :block="true" @click="handleResetConfig">重置当前配置</n-button>
  </n-space>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { NDivider, NSpace, NButton, useDialog, useMessage } from 'naive-ui';
import Clipboard from 'clipboard';
import { useThemeStore } from '@/store';

const theme = useThemeStore();
const { setDefaultThemeStore } = useThemeStore();
const dialog = useDialog();
const message = useMessage();

const copyRef = ref<HTMLElement | null>(null);
const dataClipboardText = ref(getClipboardText());

function getClipboardText() {
  return JSON.stringify(theme.$state);
}

function handleResetConfig() {
  setDefaultThemeStore();
  message.success('已重置配置，请重新拷贝！');
}

function clipboardEventListener() {
  const copy = new Clipboard(copyRef.value!);
  copy.on('success', () => {
    dialog.success({
      title: '操作成功',
      content: '复制成功,请替换 src/settings/theme.json的内容！',
      positiveText: '确定'
    });
  });
}

watch(
  () => theme.$state,
  () => {
    dataClipboardText.value = getClipboardText();
  },
  { deep: true }
);

onMounted(() => {
  clipboardEventListener();
});

// function handleSuccess() {
//   window.$dialog?.success({
//     title: '操作成功',
//     content: '复制成功,请替换 src/settings/theme.json的内容！',
//     positiveText: '确定'
//   });
// }
</script>
<style scoped></style>
