<script setup lang="ts">
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

const { domRef: stackedDashAreaRef } = useVChart(() => stackedDashAreaSpec);
const { domRef: barMarkPointRef } = useVChart(() => barMarkPointSpec);
const { domRef: histogramDifferentBinRef } = useVChart(() => histogramDifferentBinSpec);
const { domRef: rankingBarRef } = useVChart(() => rankingBarSpec);
const { domRef: shapeWordCloudRef } = useVChart(() => shapeWordCloudSpec);
const { domRef: circularProgressTickRef } = useVChart(() => circularProgressTickSpec);
const { domRef: liquidChartSmartInvertRef } = useVChart(() => liquidChartSmartInvertSpec);
</script>

<template>
  <NSpace vertical :size="16">
    <NCard :bordered="false" title="VChart" class="h-full card-wrapper">
      <WebSiteLink label="More Demos: " link="https://www.visactor.com/vchart/example" />
    </NCard>
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
  </NSpace>
</template>

<style scoped></style>
