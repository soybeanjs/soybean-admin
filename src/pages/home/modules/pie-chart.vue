<script setup lang="ts">
import { useTemplateRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { SCard } from '@vean/ui';
import { useAppStore } from '@/store';
import { useEcharts } from '@/composables/use-echarts';
import type { ECOption } from '@/composables/use-echarts';

defineOptions({ name: 'HomePieChart' });

const { t } = useI18n();
const appStore = useAppStore();

/** 作息安排（v2 对齐的静态值：学习 / 娱乐 / 工作 / 休息） */
const SCHEDULE_VALUES: number[] = [20, 10, 40, 30];

function createOptions(): ECOption {
  const labels = [t('page.home.study'), t('page.home.entertainment'), t('page.home.work'), t('page.home.rest')];

  return {
    tooltip: { trigger: 'item' },
    legend: { bottom: '1%', left: 'center', itemStyle: { borderWidth: 0 } },
    series: [
      {
        color: ['#5da8ff', '#8e9dff', '#fedc69', '#26deca'],
        name: t('page.home.schedule'),
        type: 'pie',
        radius: ['45%', '75%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 1 },
        label: { show: false, position: 'center' },
        emphasis: { label: { show: true, fontSize: 12 } },
        labelLine: { show: false },
        data: labels.map((name, index) => ({ name, value: SCHEDULE_VALUES[index] }))
      }
    ]
  };
}

const chartRef = useTemplateRef<HTMLElement>('chart');

const { updateOptions } = useEcharts(chartRef, createOptions);

watch(
  () => appStore.locale,
  () => {
    void updateOptions(createOptions);
  }
);
</script>

<template>
  <SCard size="sm" :title="t('page.home.schedule')">
    <div ref="chart" class="h-80 w-full overflow-hidden" />
  </SCard>
</template>
