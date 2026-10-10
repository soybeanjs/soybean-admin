<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { SCard } from '@vean/ui';
import { useVChart } from '@/composables/use-vchart';
import { PluginDocLinks } from '@/views/plugin/modules';
import {
  barMarkPointSpec,
  histogramDifferentBinSpec,
  rankingBarSpec,
  shapeWordCloudSpec,
  stackedDashAreaSpec
} from './data';

/**
 * VChart 演示（P4-01）。
 *
 * 与 v2 的差异：v2 的 `liquid` 与 `circularProgress` 两个演示依赖
 * `registerLiquidChart()` —— 本仓只 `import VChart from '@visactor/vchart'`
 * （`use-vchart.ts` 里不额外注册图表类型），`vchart-all` 只内建了
 * wordCloud / histogram / bar / area 等常用图，液面图与环形进度图在本版
 * **不注册**。因此这里砍掉两个演示，保留 5 个能跑的。
 */
defineOptions({ name: 'PluginChartsVchart' });

const stackedDashAreaRef = useTemplateRef<HTMLElement>('stackedDashArea');
const barMarkPointRef = useTemplateRef<HTMLElement>('barMarkPoint');
const histogramDifferentBinRef = useTemplateRef<HTMLElement>('histogramDifferentBin');
const rankingBarRef = useTemplateRef<HTMLElement>('rankingBar');
const shapeWordCloudRef = useTemplateRef<HTMLElement>('shapeWordCloud');

useVChart(stackedDashAreaRef, () => stackedDashAreaSpec);
useVChart(barMarkPointRef, () => barMarkPointSpec);
useVChart(histogramDifferentBinRef, () => histogramDifferentBinSpec);
useVChart(rankingBarRef, () => rankingBarSpec);
useVChart(shapeWordCloudRef, () => shapeWordCloudSpec);
</script>

<template>
  <div class="flex flex-col gap-4">
    <SCard title="VChart">
      <PluginDocLinks :links="[{ label: 'More Demos: ', href: 'https://www.visactor.com/vchart/example' }]" />
    </SCard>
    <SCard title="Stacked Dash Area Chart">
      <div ref="stackedDashArea" class="h-100 w-full" />
    </SCard>
    <SCard title="Bar Mark Point Chart">
      <div ref="barMarkPoint" class="h-100 w-full" />
    </SCard>
    <SCard title="Histogram Different Bin Chart">
      <div ref="histogramDifferentBin" class="h-100 w-full" />
    </SCard>
    <SCard title="Ranking Bar Chart">
      <div ref="rankingBar" class="h-100 w-full" />
    </SCard>
    <SCard title="Shape Word Cloud Chart">
      <div ref="shapeWordCloud" class="h-100 w-full" />
    </SCard>
  </div>
</template>
