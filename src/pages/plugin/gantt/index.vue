<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const PluginGanttIndex = defineAsyncComponent(() => import('@/views/plugin/gantt/index.vue'));

/**
 * 甘特图分组目录：本页是分组的落地页，子项靠 `meta.menuParent` 挂到它下面。
 *
 * `src/pages/**` 只注册路由与菜单元信息，视图逻辑在 `src/views/**`（dynamic 路由
 * 模式只扫描 `src/views/**`）。
 */
definePage({
  meta: {
    title: '甘特图',
    i18nKey: 'route.pluginGantt',
    icon: 'mdi:chart-gantt',
    order: 59,
    menuParent: 'PluginIndex'
  }
});
</script>

<template>
  <PluginGanttIndex />
</template>
