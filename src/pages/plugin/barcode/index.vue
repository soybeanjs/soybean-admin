<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const PluginBarcode = defineAsyncComponent(() => import('@/views/plugin/barcode/index.vue'));

/**
 * JsBarcode 多种格式与配置。
 *
 * `src/pages/**` 只注册路由与菜单元信息，视图逻辑在 `src/views/**`（dynamic 路由
 * 模式只扫描 `src/views/**`）。
 */
definePage({
  meta: {
    title: '条形码',
    i18nKey: 'route.pluginBarcode',
    icon: 'mdi:barcode',
    order: 52,
    menuParent: 'PluginIndex'
  }
});
</script>

<template>
  <PluginBarcode />
</template>
