<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const PluginChartsVchart = defineAsyncComponent(() => import('@/views/plugin/charts/vchart/index.vue'));

/**
 * VChart 演示（生命周期钩子见 `src/composables/use-vchart.ts`）。
 *
 * `src/pages/**` 只注册路由与菜单元信息，视图逻辑在 `src/views/**`（dynamic 路由
 * 模式只扫描 `src/views/**`）。
 */
definePage({
  meta: {
    title: 'VChart',
    i18nKey: 'route.pluginChartsVchart',
    icon: 'mdi:chart-line-variant',
    order: 44,
    menuParent: 'PluginChartsIndex'
  }
});
</script>

<template>
  <PluginChartsVchart />
</template>
