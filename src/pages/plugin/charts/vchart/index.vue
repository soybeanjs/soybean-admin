<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { SCard } from '@vean/ui';
import { useVChart } from '@/composables/use-vchart';
import { PluginDocLinks } from '../../modules';
import {
  barMarkPointSpec,
  histogramDifferentBinSpec,
  rankingBarSpec,
  shapeWordCloudSpec,
  stackedDashAreaSpec
} from './data';

/** VChart 演示（P4-01） 详见 docs/v3-notes.md N-350。 */
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

definePage({
  meta: {
    title: 'VChart',
    i18nKey: 'route.pluginChartsVchart',
    icon: 'mdi:chart-line-variant',
    order: 44,
    menuParent: 'PluginChartsIndex'
  }
});
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
