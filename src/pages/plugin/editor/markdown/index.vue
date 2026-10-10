<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const PluginEditorMarkdown = defineAsyncComponent(() => import('@/views/plugin/editor/markdown/index.vue'));

/**
 * Vditor Markdown 编辑器演示。
 *
 * `src/pages/**` 只注册路由与菜单元信息，视图逻辑在 `src/views/**`（dynamic 路由
 * 模式只扫描 `src/views/**`）。
 */
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
  <PluginEditorMarkdown />
</template>
