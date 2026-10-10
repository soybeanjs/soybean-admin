<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const PluginChartsIndex = defineAsyncComponent(() => import('@/views/plugin/charts/index.vue'));

/**
 * 图表分组目录：本页是分组的落地页，子项靠 `meta.menuParent` 挂到它下面（v3 §5.8 的分组在文件式路由里没有额外语法）。
 *
 * `src/pages/**` 只注册路由与菜单元信息，视图逻辑在 `src/views/**`（dynamic 路由
 * 模式只扫描 `src/views/**`）。
 */
definePage({
  meta: {
    title: '图表',
    i18nKey: 'route.pluginCharts',
    icon: 'mdi:chart-areaspline',
    order: 42,
    menuParent: 'PluginIndex'
  }
});
</script>

<template>
  <PluginChartsIndex />
</template>
