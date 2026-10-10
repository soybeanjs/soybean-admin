<script setup lang="ts">
import { onUnmounted, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { SCard } from '@vean/ui';
import { useEcharts } from '@/composables/use-echarts';
import {
  barOptions,
  gaugeOptions,
  getPictorialBarOption,
  getScatterOption,
  lineOptions,
  pieOptions,
  radarOptions
} from './data';

/**
 * ECharts 演示（P4-01）。
 *
 * 与 v2 的差异：
 * - 用 v3 的 `useEcharts(target, factory)`（`target` 是模板 ref，v2 是零参版本）；
 * - 仪表盘时钟的 `setInterval` 只在 `onMounted` 起、`onUnmounted` 清（v2 在
 *   setup 里直接起，组件报错也照跑）；
 * - `v2` 的 `min-800px`/`h-400px` 这类长度改成 UnoCSS 的 `h-100`（= 400px）。
 */
defineOptions({ name: 'PluginChartsEcharts' });

const { t } = useI18n();

const pieRef = useTemplateRef<HTMLElement>('pieChart');
const lineRef = useTemplateRef<HTMLElement>('lineChart');
const barRef = useTemplateRef<HTMLElement>('barChart');
const radarRef = useTemplateRef<HTMLElement>('radarChart');
const scatterRef = useTemplateRef<HTMLElement>('scatterChart');
const pictorialBarRef = useTemplateRef<HTMLElement>('pictorialBarChart');
const gaugeRef = useTemplateRef<HTMLElement>('gaugeChart');

useEcharts(pieRef, () => pieOptions);
useEcharts(lineRef, () => lineOptions);
useEcharts(barRef, () => barOptions);
useEcharts(radarRef, () => radarOptions);
useEcharts(scatterRef, () => getScatterOption());
useEcharts(pictorialBarRef, () => getPictorialBarOption());

const { setOptions: setGaugeOptions } = useEcharts(gaugeRef, () => gaugeOptions);

let timer: ReturnType<typeof setInterval> | null = null;

/** 每秒钟把时针 / 分针 / 秒针的角度推进一格（v2 同款时钟效果） */
function tickGauge() {
  const date = new Date();
  const second = date.getSeconds();
  const minute = date.getMinutes() + second / 60;
  const hour = (date.getHours() % 12) + minute / 60;

  setGaugeOptions({
    animationDurationUpdate: 300,
    series: [
      { name: 'hour', animation: hour !== 0, data: [{ value: hour }] },
      { name: 'minute', animation: minute !== 0, data: [{ value: minute }] },
      { name: 'second', animation: second !== 0, data: [{ value: second }] }
    ]
  });
}

if (typeof window !== 'undefined') {
  timer = setInterval(tickGauge, 1000);
}

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <SCard :title="t('plugin.chartPie')">
      <div ref="pieChart" class="h-100 w-full" />
    </SCard>
    <SCard :title="t('plugin.chartLine')">
      <div ref="lineChart" class="h-100 w-full" />
    </SCard>
    <SCard :title="t('plugin.chartBar')">
      <div ref="barChart" class="h-100 w-full" />
    </SCard>
    <SCard :title="t('plugin.chartRadar')">
      <div ref="radarChart" class="h-100 w-full" />
    </SCard>
    <SCard :title="t('plugin.chartScatter')">
      <div ref="scatterChart" class="h-150 w-full" />
    </SCard>
    <SCard :title="t('plugin.chartPictorialBar')">
      <div ref="pictorialBarChart" class="h-150 w-full" />
    </SCard>
    <SCard :title="t('plugin.chartGauge')">
      <div ref="gaugeChart" class="h-160 w-full" />
    </SCard>
  </div>
</template>
