<script setup lang="ts">
import { onUnmounted } from 'vue';
import type {
  IAreaChartSpec,
  IBarChartSpec,
  ICircularProgressChartSpec,
  IHistogramChartSpec,
  ILiquidChartSpec
} from '@visactor/vchart';
import { useVChart } from '@/hooks/common/vchart';
import {
  barMarkPointSpec,
  circularProgressTickSpec,
  histogramDifferentBinSpec,
  liquidChartSmartInvertSpec,
  rankingBarSpec,
  shapeWordCloudSpec,
  stackedDashAreaSpec
} from './data';

const { domRef: stackedDashAreaRef } = useVChart(() => stackedDashAreaSpec as IAreaChartSpec, { onRender() {} });
const { domRef: barMarkPointRef } = useVChart(() => barMarkPointSpec as IBarChartSpec, { onRender() {} });
const { domRef: histogramDifferentBinRef } = useVChart(() => histogramDifferentBinSpec as IHistogramChartSpec, {
  onRender() {}
});
const { domRef: rankingBarRef } = useVChart(() => rankingBarSpec as IBarChartSpec, { onRender() {} });
const { domRef: shapeWordCloudRef } = useVChart(() => shapeWordCloudSpec, { onRender() {} });
const { domRef: circularProgressTickRef } = useVChart(() => circularProgressTickSpec as ICircularProgressChartSpec, {
  onRender() {}
});
const { domRef: liquidChartSmartInvertRef } = useVChart(() => liquidChartSmartInvertSpec as ILiquidChartSpec, {
  onRender() {}
});

onUnmounted(() => {
  // clearGaugeChart();
});
</script>

<template>
  <NSpace vertical :size="16">
    <NCard title="Stacked Dash Area Chart" :bordered="false" class="h-full card-wrapper">
      <div ref="stackedDashAreaRef" class="h-400px" />
    </NCard>
    <NCard title="Bar Mark Point Chart" :bordered="false" class="h-full card-wrapper">
      <div ref="barMarkPointRef" class="h-400px" />
    </NCard>
    <NCard title="Histogram Different Bin Chart" :bordered="false" class="h-full card-wrapper">
      <div ref="histogramDifferentBinRef" class="h-400px" />
    </NCard>
    <NCard title="Ranking Bar Chart" :bordered="false" class="h-full card-wrapper">
      <div ref="rankingBarRef" class="h-400px" />
    </NCard>
    <NCard title="Circular Progress Tick Chart" :bordered="false" class="h-full card-wrapper">
      <div ref="circularProgressTickRef" class="h-400px" />
    </NCard>
    <NCard title="Liquid Chart Smart Invert Chart" :bordered="false" class="h-full card-wrapper">
      <div ref="liquidChartSmartInvertRef" class="h-400px" />
    </NCard>
    <NCard title="Shape Word Cloud Chart" :bordered="false" class="h-full card-wrapper">
      <div ref="shapeWordCloudRef" class="h-400px" />
    </NCard>
    <NCard :bordered="false" class="h-full w-2/3 card-wrapper">
      <WebSiteLink label="More VChart Demos: " link="https://www.visactor.com/vchart/example" />
    </NCard>
  </NSpace>
</template>

<style scoped></style>
