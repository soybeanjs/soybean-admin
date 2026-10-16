<script setup lang="ts">
import { onUnmounted, useTemplateRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTheme, SCard } from '@vean/ui';
import Vditor from 'vditor';
import 'vditor/dist/index.css';

/** 与 v2 的差异： 详见 docs/v3-notes.md N-352。 */
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

definePage({
  meta: {
    title: 'Markdown',
    i18nKey: 'route.pluginEditorMarkdown',
    icon: 'mdi:language-markdown',
    order: 47,
    menuParent: 'PluginEditorIndex'
  }
});
</script>

<template>
  <SCard :title="t('plugin.markdown')">
    <div ref="editorRef" class="w-full" />
  </SCard>
</template>
