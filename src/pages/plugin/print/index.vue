<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const PluginPrint = defineAsyncComponent(() => import('@/views/plugin/print/index.vue'));

/**
 * print-js 打印表格与图片。
 *
 * `src/pages/**` 只注册路由与菜单元信息，视图逻辑在 `src/views/**`（dynamic 路由
 * 模式只扫描 `src/views/**`）。
 */
definePage({
  meta: {
    title: '打印',
    i18nKey: 'route.pluginPrint',
    icon: 'mdi:printer',
    order: 51,
    menuParent: 'PluginIndex'
  }
});
</script>

<template>
  <PluginPrint />
</template>
