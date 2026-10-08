<script setup lang="ts">
import { useTemplateRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { SCard } from '@vean/ui';
import { useAppStore } from '@/store';
import { useEcharts } from '@/composables/use-echarts';
import type { ECOption } from '@/composables/use-echarts';

defineOptions({ name: 'HomeLineChart' });

const { t } = useI18n();
const appStore = useAppStore();

const TIMELINE: string[] = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00'];
const DOWNLOAD_TREND: number[] = [4623, 6145, 6268, 6411, 1890, 4251, 2978, 3880, 3606, 4311];
const REGISTER_TREND: number[] = [2208, 2016, 2916, 4512, 8281, 2008, 1963, 2367, 2956, 678];

function createOptions(): ECOption {
  const downloadLabel = t('page.home.downloadCount');
  const registerLabel = t('page.home.registerCount');

  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    legend: { data: [downloadLabel, registerLabel] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: TIMELINE },
    yAxis: { type: 'value' },
    series: [
      {
        color: '#8e9dff',
        name: downloadLabel,
        type: 'line',
        smooth: true,
        stack: 'Total',
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0.25, color: '#8e9dff' },
              { offset: 1, color: '#fff' }
            ]
          }
        },
        emphasis: { focus: 'series' },
        data: DOWNLOAD_TREND
      },
      {
        color: '#26deca',
        name: registerLabel,
        type: 'line',
        smooth: true,
        stack: 'Total',
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0.25, color: '#26deca' },
              { offset: 1, color: '#fff' }
            ]
          }
        },
        emphasis: { focus: 'series' },
        data: REGISTER_TREND
      }
    ]
  };
}

const chartRef = useTemplateRef<HTMLElement>('chart');

const { updateOptions } = useEcharts(chartRef, createOptions);

/** 图例与 tooltip 文案随语言重算（图表 option 不参与 i18n 响应式） */
watch(
  () => appStore.locale,
  () => {
    void updateOptions(createOptions);
  }
);
</script>

<template>
  <SCard size="sm" :title="t('page.home.visitTrend')">
    <div ref="chart" class="h-80 w-full overflow-hidden" />
  </SCard>
</template>
