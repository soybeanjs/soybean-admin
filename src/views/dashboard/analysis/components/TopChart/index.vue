<template>
  <n-grid :x-gap="16" :y-gap="16" :item-responsive="true">
    <n-grid-item span="0:24 640:24 1024:16">
      <n-card :bordered="false" class="rounded-16px shadow-sm">
        <div class="flex w-full h-360px">
          <div class="w-200px h-full py-12px">
            <h3 class="text-16px font-bold">Dashboard</h3>
            <p class="text-[#aaa]">Overview Of Lasted Month</p>
            <h3 class="pt-36px text-24px font-bold">
              <count-to prefix="$" :start-value="0" :end-value="7754" />
            </h3>
            <p class="text-[#aaa]">Current Month Earnings</p>
            <h3 class="pt-36px text-24px font-bold">
              <count-to :start-value="0" :end-value="1234" />
            </h3>
            <p class="text-[#aaa]">Current Month Sales</p>
            <n-button class="mt-24px" type="primary">Last Month Summary</n-button>
          </div>
          <div class="flex-1-hidden h-full">
            <div ref="lineRef" class="wh-full"></div>
          </div>
        </div>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:8">
      <n-card :bordered="false" class="rounded-16px shadow-sm">
        <div ref="pieRef" class="w-full h-360px"></div>
      </n-card>
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Line, Pie } from '@antv/g2plot';
import { CountTo } from '@/components';
import data from './data.json';

const lineRef = ref<HTMLElement>();
const line = ref<Line>();
const pieRef = ref<HTMLElement>();
const pie = ref<Pie>();

function renderLineChart() {
  if (!lineRef.value) return;
  line.value = new Line(lineRef.value, {
    data,
    autoFit: true,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    lineStyle: {
      lineWidth: 4
    },
    area: {
      style: {
        fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff'
      }
    },
    smooth: true,
    animation: {
      appear: {
        animation: 'wave-in',
        duration: 2000
      }
    }
  });
  line.value.render();
}
function renderPieChart() {
  const data = [
    { type: '学习', value: 20 },
    { type: '娱乐', value: 10 },
    { type: '工作', value: 30 },
    { type: '休息', value: 40 }
  ];
  pie.value = new Pie(pieRef.value!, {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0.65,
    meta: {
      value: {
        formatter: v => `${v}%`
      }
    },
    label: {
      type: 'inner',
      autoRotate: false,
      formatter: ({ percent }) => `${(percent * 100).toFixed(0)}%`
    },
    statistic: undefined,
    pieStyle: {
      radius: [20]
    },
    color: ['#025DF4', '#DB6BCF', '#2498D1', '#FF745A', '#007E99', '#FFA8A8', '#2391FF'],
    legend: {
      position: 'bottom'
    },
    interactions: [
      { type: 'element-selected' },
      { type: 'element-active' },
      {
        type: 'pie-statistic-active',
        cfg: {
          start: [
            { trigger: 'element:mouseenter', action: 'pie-statistic:change' },
            { trigger: 'legend-item:mouseenter', action: 'pie-statistic:change' }
          ],
          end: [
            { trigger: 'element:mouseleave', action: 'pie-statistic:reset' },
            { trigger: 'legend-item:mouseleave', action: 'pie-statistic:reset' }
          ]
        }
      }
    ]
  });

  pie.value.render();
}

onMounted(() => {
  renderLineChart();
  renderPieChart();
});
</script>
<style></style>
