<script setup lang="ts">
import { onMounted, onUnmounted, shallowRef, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { SCard } from '@vean/ui';
import WangEditor from 'wangeditor';

/**
 * 富文本编辑器（wangEditor，P4-01）。
 *
 * 与 v2 的差异：
 * - 主题由 CSS 变量接管：把工具栏与编辑区的背景改成 `inherit`，容器跟着
 *   `@vean/ui` 的 `--vean-card` 走，不用再单独判断明暗；
 * - `z-index` 从 10 提到 `var(--vean-z-toast)` 之下 —— 下拉面板要盖住卡片，
 *   但不能盖住 toast；
 * - v2 没销毁实例 → 这里 `onUnmounted` 调 `destroy()`。
 */
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
