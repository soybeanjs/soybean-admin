<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const PluginChartsAntv = defineAsyncComponent(() => import('@/views/plugin/charts/antv/index.vue'));

/**
 * AntV G6 流程图演示。
 *
 * `src/pages/**` 只注册路由与菜单元信息，视图逻辑在 `src/views/**`（dynamic 路由
 * 模式只扫描 `src/views/**`）。
 */
definePage({
  meta: {
    title: 'AntV G6',
    i18nKey: 'route.pluginChartsAntv',
    icon: 'mdi:graph-outline',
    order: 45,
    menuParent: 'PluginChartsIndex'
  }
});
</script>

<template>
  <PluginChartsAntv />
</template>
