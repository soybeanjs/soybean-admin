<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const PluginGanttDhtmlx = defineAsyncComponent(() => import('@/views/plugin/gantt/dhtmlx/index.vue'));

/**
 * dhtmlx-gantt 演示（日 / 周 / 月 / 季 / 年缩放）。
 *
 * `src/pages/**` 只注册路由与菜单元信息，视图逻辑在 `src/views/**`（dynamic 路由
 * 模式只扫描 `src/views/**`）。
 */
definePage({
  meta: {
    title: 'DHTMLX',
    i18nKey: 'route.pluginGanttDhtmlx',
    icon: 'mdi:chart-timeline-variant',
    order: 60,
    menuParent: 'PluginGanttIndex'
  }
});
</script>

<template>
  <PluginGanttDhtmlx />
</template>
