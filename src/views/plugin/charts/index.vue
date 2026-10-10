<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { SCard } from '@vean/ui';
import { PluginGroup } from '../modules';

/**
 * 图表分组落地页（P4-01）。
 *
 * 分组在侧栏里是一个父节点，点进来要能看到本组全部子页 —— 文件式路由没有
 * 「无视图目录」的概念，所以每个分组自己带一个真实页面。
 */
defineOptions({ name: 'PluginChartsIndex' });

const { t } = useI18n();

const links = [
  { path: '/plugin/charts/echarts', label: t('route.pluginChartsEcharts'), icon: 'simple-icons:apacheecharts' },
  { path: '/plugin/charts/vchart', label: t('route.pluginChartsVchart'), icon: 'mdi:chart-line-variant' },
  { path: '/plugin/charts/antv', label: t('route.pluginChartsAntv'), icon: 'mdi:graph-outline' }
];
</script>

<template>
  <SCard :title="t('route.pluginCharts')">
    <PluginGroup :description="t('plugin.chartsTip')" :links="links" />
  </SCard>
</template>
