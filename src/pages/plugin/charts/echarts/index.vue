<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const PluginChartsEcharts = defineAsyncComponent(() => import('@/views/plugin/charts/echarts/index.vue'));

/**
 * ECharts 演示（按需注册见 `src/composables/use-echarts.ts`）。
 *
 * `src/pages/**` 只注册路由与菜单元信息，视图逻辑在 `src/views/**`（dynamic 路由
 * 模式只扫描 `src/views/**`）。
 */
definePage({
  meta: {
    title: 'ECharts',
    i18nKey: 'route.pluginChartsEcharts',
    icon: 'simple-icons:apacheecharts',
    order: 43,
    menuParent: 'PluginChartsIndex'
  }
});
</script>

<template>
  <PluginChartsEcharts />
</template>
