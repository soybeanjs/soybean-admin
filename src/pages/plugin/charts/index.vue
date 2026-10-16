<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { SCard } from '@vean/ui';
import { PluginGroup } from '../modules';

/** 图表分组落地页（P4-01） 详见 docs/v3-notes.md N-348。 */
defineOptions({ name: 'PluginChartsIndex' });

const { t } = useI18n();

const links = [
  { path: '/plugin/charts/echarts', label: t('route.pluginChartsEcharts'), icon: 'simple-icons:apacheecharts' },
  { path: '/plugin/charts/vchart', label: t('route.pluginChartsVchart'), icon: 'mdi:chart-line-variant' },
  { path: '/plugin/charts/antv', label: t('route.pluginChartsAntv'), icon: 'mdi:graph-outline' }
];

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
  <SCard :title="t('route.pluginCharts')">
    <PluginGroup :description="t('plugin.chartsTip')" :links="links" />
  </SCard>
</template>
