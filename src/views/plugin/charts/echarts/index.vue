<script setup lang="ts">
import { onUnmounted } from 'vue';
import { useEcharts } from '@/hooks/common/echarts';
import {
  barOptions,
  gaugeOptions,
  getPictorialBarOption,
  getScatterOption,
  lineOptions,
  pieOptions,
  radarOptions
} from './data';

const { domRef: pieRef } = useEcharts(() => pieOptions, { onRender() {} });
const { domRef: lineRef } = useEcharts(() => lineOptions, { onRender() {} });
const { domRef: barRef } = useEcharts(() => barOptions, { onRender() {} });
const { domRef: pictorialBarRef } = useEcharts(() => getPictorialBarOption(), { onRender() {} });
const { domRef: radarRef } = useEcharts(() => radarOptions, { onRender() {} });
const { domRef: scatterRef } = useEcharts(() => getScatterOption(), { onRender() {} });
const { domRef: gaugeRef, setOptions: setGaugeOptions } = useEcharts(() => gaugeOptions, { onRender() {} });

let intervalId: NodeJS.Timeout;

function initGaugeChart() {
  intervalId = setInterval(() => {
    const date = new Date();
    const second = date.getSeconds();
    const minute = date.getMinutes() + second / 60;
    const hour = (date.getHours() % 12) + minute / 60;

    setGaugeOptions({
      animationDurationUpdate: 300,
      series: [
        {
          name: 'hour',
          animation: hour !== 0,
          data: [{ value: hour }]
        },
        {
          name: 'minute',
          animation: minute !== 0,
          data: [{ value: minute }]
        },
        {
          animation: second !== 0,
          name: 'second',
          data: [{ value: second }]
        }
      ]
    });
  }, 1000);
}

function clearGaugeChart() {
  clearInterval(intervalId);
}

initGaugeChart();

onUnmounted(() => {
  clearGaugeChart();
});
</script>

<template>
  <NSpace vertical :size="16">
    <NCard :bordered="false" class="card-wrapper">
      <div ref="pieRef" class="h-400px" />
    </NCard>
    <NCard :bordered="false" class="card-wrapper">
      <div ref="lineRef" class="h-400px" />
    </NCard>
    <NCard :bordered="false" class="card-wrapper">
      <div ref="barRef" class="h-400px" />
    </NCard>
    <NCard :bordered="false" class="card-wrapper">
      <div ref="radarRef" class="h-400px"></div>
    </NCard>
    <NCard :bordered="false" class="card-wrapper">
      <div ref="scatterRef" class="h-600px"></div>
    </NCard>
    <NCard :bordered="false" class="card-wrapper">
      <div ref="pictorialBarRef" class="h-600px" />
    </NCard>
    <NCard :bordered="false" class="card-wrapper">
      <div ref="gaugeRef" class="h-640px" />
    </NCard>
  </NSpace>
</template>

<style scoped></style>
