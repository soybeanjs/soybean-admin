<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const PluginEditorIndex = defineAsyncComponent(() => import('@/views/plugin/editor/index.vue'));

/**
 * 编辑器分组目录：本页是分组的落地页，子项靠 `meta.menuParent` 挂到它下面。
 *
 * `src/pages/**` 只注册路由与菜单元信息，视图逻辑在 `src/views/**`（dynamic 路由
 * 模式只扫描 `src/views/**`）。
 */
definePage({
  meta: {
    title: '编辑器',
    i18nKey: 'route.pluginEditor',
    icon: 'mdi:square-edit-outline',
    order: 46,
    menuParent: 'PluginIndex'
  }
});
</script>

<template>
  <PluginEditorIndex />
</template>
