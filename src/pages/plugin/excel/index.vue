<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const PluginExcel = defineAsyncComponent(() => import('@/views/plugin/excel/index.vue'));

/**
 * xlsx 导出演示（数据取自真实用户列表接口）。
 *
 * `src/pages/**` 只注册路由与菜单元信息，视图逻辑在 `src/views/**`（dynamic 路由
 * 模式只扫描 `src/views/**`）。
 */
definePage({
  meta: {
    title: 'Excel 导出',
    i18nKey: 'route.pluginExcel',
    icon: 'mdi:microsoft-excel',
    order: 49,
    menuParent: 'PluginIndex'
  }
});
</script>

<template>
  <PluginExcel />
</template>
