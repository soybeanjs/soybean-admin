<script setup lang="ts">
import { computed, watch } from 'vue';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { useEcharts } from '@/hooks/chart/use-echarts';
import GradientBg from './components/gradient-bg.vue';

const appStore = useAppStore();

const gap = computed(() => (appStore.isMobile ? 0 : 16));

const { domRef: lineRef, updateOptions: updateLineOptions } = useEcharts(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  legend: {
    data: [$t('page.home.downloadCount'), $t('page.home.registerCount')]
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [] as string[]
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      color: '#8e9dff',
      name: $t('page.home.downloadCount'),
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
            {
              offset: 0.25,
              color: '#8e9dff'
            },
            {
              offset: 1,
              color: '#fff'
            }
          ]
        }
      },
      emphasis: {
        focus: 'series'
      },
      data: [] as number[]
    },
    {
      color: '#26deca',
      name: $t('page.home.registerCount'),
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
            {
              offset: 0.25,
              color: '#26deca'
            },
            {
              offset: 1,
              color: '#fff'
            }
          ]
        }
      },
      emphasis: {
        focus: 'series'
      },
      data: []
    }
  ]
}));

async function mockLineData() {
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  updateLineOptions(opts => {
    opts.xAxis.data = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00'];
    opts.series[0].data = [4623, 6145, 6268, 6411, 1890, 4251, 2978, 3880, 3606, 4311];
    opts.series[1].data = [2208, 2016, 2916, 4512, 8281, 2008, 1963, 2367, 2956, 678];

    return opts;
  });
}

function updateLineLocale() {
  updateLineOptions((opts, factory) => {
    const originOpts = factory();

    opts.legend.data = originOpts.legend.data;
    opts.series[0].name = originOpts.series[0].name;
    opts.series[1].name = originOpts.series[1].name;

    return opts;
  });
}

const { domRef: pieRef, updateOptions: updatePieOptions } = useEcharts(() => ({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    bottom: '1%',
    left: 'center',
    itemStyle: {
      borderWidth: 0
    }
  },
  series: [
    {
      color: ['#5da8ff', '#8e9dff', '#fedc69', '#26deca'],
      name: $t('page.home.schedule'),
      type: 'pie',
      radius: ['45%', '75%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 1
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '12'
        }
      },
      labelLine: {
        show: false
      },
      data: [] as { name: string; value: number }[]
    }
  ]
}));

async function mockPieData() {
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  updatePieOptions(opts => {
    opts.series[0].data = [
      { name: $t('page.home.study'), value: 20 },
      { name: $t('page.home.entertainment'), value: 10 },
      { name: $t('page.home.work'), value: 40 },
      { name: $t('page.home.rest'), value: 30 }
    ];

    return opts;
  });
}

function updatePieLocale() {
  updatePieOptions((opts, factory) => {
    const originOpts = factory();

    opts.series[0].name = originOpts.series[0].name;

    opts.series[0].data = [
      { name: $t('page.home.study'), value: 20 },
      { name: $t('page.home.entertainment'), value: 10 },
      { name: $t('page.home.work'), value: 40 },
      { name: $t('page.home.rest'), value: 30 }
    ];

    return opts;
  });
}

interface CardData {
  key: string;
  title: string;
  value: number;
  unit: string;
  colors: [string, string];
  icon: string;
}

const cardData = computed<CardData[]>(() => [
  {
    key: 'visit',
    title: $t('page.home.visit'),
    value: 1000000,
    unit: '',
    colors: ['#ec4786', '#b955a4'],
    icon: 'ant-design:bar-chart-outlined'
  },
  {
    key: 'amount',
    title: $t('page.home.amount'),
    value: 234567.89,
    unit: '$',
    colors: ['#865ec0', '#5144b4'],
    icon: 'ant-design:money-collect-outlined'
  },
  {
    key: 'download',
    title: $t('page.home.downloadCount'),
    value: 666666,
    unit: '',
    colors: ['#56cdf3', '#719de3'],
    icon: 'carbon:document-download'
  },
  {
    key: 'trade',
    title: $t('page.home.trade'),
    value: 999999,
    unit: '',
    colors: ['#fcbc25', '#f68057'],
    icon: 'ant-design:trademark-circle-outlined'
  }
]);

async function init() {
  mockLineData();
  mockPieData();
}

watch(
  () => appStore.locale,
  () => {
    updateLineLocale();
    updatePieLocale();
  }
);

// init
init();
</script>

<template>
  <NSpace vertical :size="16">
    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:6">
        <NCard :bordered="false" class="card-wrapper">
          <div class="w-full h-360px py-12px">
            <h3 class="text-16px font-bold">Dashboard</h3>
            <p class="text-#aaa">Overview Of Lasted Month</p>
            <h3 class="pt-32px text-24px font-bold">
              <CountTo prefix="$" :start-value="0" :end-value="7754" />
            </h3>
            <p class="text-#aaa">Current Month Earnings</p>
            <h3 class="pt-32px text-24px font-bold">
              <CountTo :start-value="0" :end-value="1234" />
            </h3>
            <p class="text-#aaa">Current Month Sales</p>
            <NButton class="mt-24px whitespace-pre-wrap" type="primary">Last Month Summary</NButton>
          </div>
        </NCard>
      </NGi>
      <NGi span="24 s:24 m:10">
        <NCard :bordered="false" class="card-wrapper">
          <div ref="lineRef" class="h-360px overflow-hidden"></div>
        </NCard>
      </NGi>
      <NGi span="24 s:24 m:8">
        <NCard :bordered="false" class="card-wrapper">
          <div ref="pieRef" class="h-360px"></div>
        </NCard>
      </NGi>
    </NGrid>
    <NCard :bordered="false" class="card-wrapper">
      <NGrid cols="s:1 m:2 l:4" responsive="screen" :x-gap="16" :y-gap="16">
        <NGi v-for="item in cardData" :key="item.key">
          <GradientBg :start-color="item.colors[0]" :end-color="item.colors[1]" class="flex-1">
            <h3 class="text-16px">{{ item.title }}</h3>
            <div class="flex justify-between pt-12px">
              <SvgIcon :icon="item.icon" class="text-32px" />
              <CountTo
                :prefix="item.unit"
                :start-value="1"
                :end-value="item.value"
                class="text-30px text-white dark:text-dark"
              />
            </div>
          </GradientBg>
        </NGi>
      </NGrid>
    </NCard>
  </NSpace>
</template>

<style scoped></style>
