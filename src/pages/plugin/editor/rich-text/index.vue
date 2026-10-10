<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const PluginEditorRichText = defineAsyncComponent(() => import('@/views/plugin/editor/rich-text/index.vue'));

/**
 * wangEditor 富文本编辑器演示。
 *
 * `src/pages/**` 只注册路由与菜单元信息，视图逻辑在 `src/views/**`（dynamic 路由
 * 模式只扫描 `src/views/**`）。
 */
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
  <PluginEditorRichText />
</template>
