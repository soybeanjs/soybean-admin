<script setup lang="ts">
import { onUnmounted, useTemplateRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTheme, SCard } from '@vean/ui';
import Vditor from 'vditor';
import 'vditor/dist/index.css';

/**
 * Markdown 编辑器（vditor，P4-01）。
 *
 * 与 v2 的差异：
 * - `useThemeStore().darkMode` → `@vean/ui` 的 `useTheme().effectiveMode`；
 * - v2 用 `watch(..., v => vditor.setTheme(...))` 但**在 `onUnmounted` 里才停
 *   监听**，且 `vditor` 引用没销毁（编辑器实例与 DOM 一起泄漏）→ 这里统一在
 *   `onUnmounted` 销毁实例、停 watch；
 * - vditor 的主题切换是命令式的（`setTheme`），不会自己跟着 CSS 变量走。
 */
defineOptions({ name: 'PluginEditorMarkdown' });

const { t } = useI18n();
const { effectiveMode } = useTheme();

const domRef = useTemplateRef<HTMLDivElement>('editorRef');

/** vditor 只有 `dark` / `classic` 两套内置主题，与明暗模式一一对应 */
function resolveTheme(): 'dark' | 'classic' {
  return effectiveMode.value === 'dark' ? 'dark' : 'classic';
}

let editor: Vditor | null = null;

const stopThemeWatch = watch(effectiveMode, () => {
  editor?.setTheme(resolveTheme());
});

function initEditor() {
  if (!domRef.value) {
    return;
  }

  editor = new Vditor(domRef.value, {
    minHeight: 400,
    theme: resolveTheme(),
    icon: 'material',
    cache: { enable: false }
  });
}

onUnmounted(() => {
  stopThemeWatch();
  editor?.destroy();
  editor = null;
});

initEditor();
</script>

<template>
  <SCard :title="t('plugin.markdown')">
    <div ref="editorRef" class="w-full" />
  </SCard>
</template>
