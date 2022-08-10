<template>
  <div class="h-full">
    <n-card title="富文本插件" class="shadow-sm rounded-16px">
      <div ref="domRef" class="bg-white dark:bg-dark"></div>
      <template #footer>
        <github-link link="https://github.com/wangeditor-team/wangEditor" />
      </template>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import WangEditor from 'wangeditor';

const editor = ref<WangEditor>();
const domRef = ref<HTMLElement>();

function renderWangEditor() {
  editor.value = new WangEditor(domRef.value);
  setEditorConfig();
  editor.value.create();
}

function setEditorConfig() {
  if (editor.value?.config?.zIndex) {
    editor.value.config.zIndex = 10;
  }
}

onMounted(() => {
  renderWangEditor();
});
</script>

<style scoped>
:deep(.w-e-toolbar) {
  background: inherit !important;
  border-color: #999 !important;
}
:deep(.w-e-text-container) {
  background: inherit;
  border-color: #999 !important;
}
</style>
