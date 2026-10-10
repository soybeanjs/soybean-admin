<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const PluginCopy = defineAsyncComponent(() => import('@/views/plugin/copy/index.vue'));

/**
 * 剪贴板演示（Clipboard API）。
 *
 * `src/pages/**` 只注册路由与菜单元信息，视图逻辑在 `src/views/**`（dynamic 路由
 * 模式只扫描 `src/views/**`）。
 */
definePage({
  meta: {
    title: '文本复制',
    i18nKey: 'route.pluginCopy',
    icon: 'mdi:clipboard-outline',
    order: 40,
    menuParent: 'PluginIndex'
  }
});
</script>

<template>
  <PluginCopy />
</template>
