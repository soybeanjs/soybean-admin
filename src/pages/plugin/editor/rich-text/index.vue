<script setup lang="ts">
import { onMounted, onUnmounted, shallowRef, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { SCard } from '@vean/ui';
import WangEditor from 'wangeditor';

/** 与 v2 的差异： 详见 docs/v3-notes.md N-353。 */
defineOptions({ name: 'PluginEditorRichText' });

const { t } = useI18n();

const domRef = useTemplateRef<HTMLDivElement>('editorRef');

/** 编辑器实例（`wangeditor` 的类型只暴露 `config` / `create` / `destroy` 这几个用到的成员） */
const editor = shallowRef<WangEditor>();

onMounted(() => {
  const dom = domRef.value;

  if (!dom) {
    return;
  }

  const instance = new WangEditor(dom);

  // 下拉面板要盖住卡片内容（卡片自身 z-index 低于 10），但不能压过 toast
  instance.config.zIndex = 10;
  instance.create();
  editor.value = instance;
});

onUnmounted(() => {
  editor.value?.destroy();
  editor.value = undefined;
});

definePage({
  meta: {
    title: '富文本',
    i18nKey: 'route.pluginEditorRichText',
    icon: 'mdi:file-document-edit-outline',
    order: 48,
    menuParent: 'PluginEditorIndex'
  }
});
</script>

<template>
  <SCard :title="t('plugin.richText')">
    <div ref="editorRef" class="w-full" />
  </SCard>
</template>

<style scoped>
/* 让编辑器的背景与边框跟随主题变量，而不是它自带的浅色硬编码值 */
:deep(.w-e-toolbar),
:deep(.w-e-text-container) {
  background: inherit;
  border-color: var(--vean-border);
}
</style>
