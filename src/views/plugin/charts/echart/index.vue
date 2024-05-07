<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';

import { useAppStore } from '@/store/modules/app';
import { useEcharts } from '@/hooks/common/echarts';
import {
  barOptions,
  gaugeOptions,
  getPictorialBarOption,
  getScatterOption,
  lineOptions,
  pieOptions,
  radarOptions
} from './_inner/echarts.data';

const appStore = useAppStore();

const gap = computed(() => (appStore.isMobile ? 0 : 16));

const { domRef: pieRef, updateOptions: pieUpdateOptions } = useEcharts(() => pieOptions);
const { domRef: lineRef, updateOptions: lineUpdateOptions } = useEcharts(() => lineOptions);

const { domRef: barRef, updateOptions: barUpdateOptions } = useEcharts(() => barOptions);
const { domRef: pictorialBarRef, updateOptions: pictorialBarUpdateOptions } = useEcharts(() => getPictorialBarOption());

const { domRef: radarRef, updateOptions: radarUpdateOptions } = useEcharts(() => radarOptions);
const { domRef: scatterRef, updateOptions: scatterUpdateOptions } = useEcharts(() => getScatterOption());

//
const { domRef: gaugeRef, updateOptions: gaugeUpdateOptions } = useEcharts(() => gaugeOptions);
const loadPreDataFn = () => {
  setTimeout(() => {
    pieUpdateOptions(opts => {
      // 数据更新
      return opts;
    });
  }, 1000);
};
const loadLineDataFn = () => {
  setTimeout(() => {
    lineUpdateOptions(opts => {
      // 数据更新
      return opts;
    });
  }, 1000);
};
const loadBarDataFn = () => {
  setTimeout(() => {
    barUpdateOptions(opts => {
      // 数据更新
      return opts;
    });
  }, 1000);
};
const loadPictorialBarDataFn = () => {
  setTimeout(() => {
    pictorialBarUpdateOptions(opts => {
      // 数据更新
      return opts;
    });
  }, 1000);
};
const loadRadarDataFn = () => {
  setTimeout(() => {
    radarUpdateOptions(opts => {
      // 数据更新
      return opts;
    });
  }, 1000);
};
const loadScatterDataFn = () => {
  setTimeout(() => {
    scatterUpdateOptions(opts => {
      // 数据更新
      return opts;
    });
  }, 1000);
};
let intervalId: NodeJS.Timeout;
const loadGaugeDataFn = () => {
  intervalId = setTimeout(() => {
    console.log('gaugeUpdateOptions');
    gaugeUpdateOptions(opts => {
      // 数据更新
      // const date = new Date();
      // const second = date.getSeconds();
      // const minute = date.getMinutes() + second / 60;
      // const hour = (date.getHours() % 12) + minute / 60;
      // opts.animationDurationUpdate = 300;
      // opts.series[0].data = [{ value: hour }];
      // opts.series[1].data = [{ value: minute }];
      // opts.series[2].data = [{ value: second }];

      return opts;
    });
  }, 1000);
};
onMounted(() => {
  loadPreDataFn();
  loadLineDataFn();
  loadBarDataFn();
  loadPictorialBarDataFn();
  loadRadarDataFn();
  loadScatterDataFn();
  loadGaugeDataFn();
});
onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<template>
  <NSpace vertical :size="16">
    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:12">
        <NCard :bordered="false" class="card-wrapper">
          <div ref="pieRef" class="h-400px" />
        </NCard>
      </NGi>
      <NGi span="24 s:24 m:12">
        <NCard :bordered="false" class="card-wrapper">
          <div ref="lineRef" class="h-400px" />
        </NCard>
      </NGi>
    </NGrid>
    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:12">
        <NCard :bordered="false" class="card-wrapper">
          <div ref="barRef" class="h-400px" />
        </NCard>
      </NGi>
      <NGi span="24 s:24 m:12">
        <NCard :bordered="false" class="card-wrapper">
          <div ref="radarRef" class="h-400px"></div>
        </NCard>
      </NGi>
    </NGrid>
    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:12">
        <NCard :bordered="false" class="card-wrapper">
          <div ref="scatterRef" class="h-600px"></div>
        </NCard>
      </NGi>
      <NGi span="24 s:24 m:12">
        <NCard :bordered="false" class="card-wrapper">
          <div ref="pictorialBarRef" class="h-600px" />
        </NCard>
      </NGi>
    </NGrid>
    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:24">
        <NCard :bordered="false" class="card-wrapper">
          <div ref="gaugeRef" class="h-640px" />
        </NCard>
      </NGi>
    </NGrid>
  </NSpace>
</template>

<style scoped></style>
