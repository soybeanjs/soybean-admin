<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const PluginPdf = defineAsyncComponent(() => import('@/views/plugin/pdf/index.vue'));

/**
 * vue-pdf-embed 预览 / 旋转 / 打印 / 下载。
 *
 * `src/pages/**` 只注册路由与菜单元信息，视图逻辑在 `src/views/**`（dynamic 路由
 * 模式只扫描 `src/views/**`）。
 */
definePage({
  meta: {
    title: 'PDF 预览',
    i18nKey: 'route.pluginPdf',
    icon: 'mdi:file-pdf-box',
    order: 50,
    menuParent: 'PluginIndex'
  }
});
</script>

<template>
  <PluginPdf />
</template>
