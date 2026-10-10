<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const PluginGanttVtable = defineAsyncComponent(() => import('@/views/plugin/gantt/vtable/index.vue'));

/**
 * VTable Gantt 演示（基础 / 依赖连线 / 自定义渲染）。
 *
 * `src/pages/**` 只注册路由与菜单元信息，视图逻辑在 `src/views/**`（dynamic 路由
 * 模式只扫描 `src/views/**`）。
 */
definePage({
  meta: {
    title: 'VTable',
    i18nKey: 'route.pluginGanttVtable',
    icon: 'mdi:table-clock',
    order: 61,
    menuParent: 'PluginGanttIndex'
  }
});
</script>

<template>
  <PluginGanttVtable />
</template>
