<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import CountTo from '@/components/count-to/index.vue';

defineOptions({ name: 'HomeStatCards' });

interface StatCardItem {
  key: string;
  title: string;
  value: number;
  prefix: string;
  icon: string;
  gradient: string;
}

const { t } = useI18n();

/** 渐变配色沿用 v2 工作台（P3-01 对齐），第 2 张带货币前缀 */
const GRADIENTS = {
  visit: 'linear-gradient(45deg, #ec4786 0%, #b955a4 100%)',
  turnover: 'linear-gradient(45deg, #865ec0 0%, #5144b4 100%)',
  download: 'linear-gradient(45deg, #56cdf3 0%, #719de3 100%)',
  deal: 'linear-gradient(45deg, #fcbc25 0%, #f68057 100%)'
} as const;

const cards = computed<StatCardItem[]>(() => [
  {
    key: 'visit',
    title: t('page.home.visitCount'),
    value: 9725,
    prefix: '',
    icon: 'i-lucide:eye',
    gradient: GRADIENTS.visit
  },
  {
    key: 'turnover',
    title: t('page.home.turnover'),
    value: 1026,
    prefix: '$',
    icon: 'i-lucide:circle-dollar-sign',
    gradient: GRADIENTS.turnover
  },
  {
    key: 'download',
    title: t('page.home.downloadCount'),
    value: 970925,
    prefix: '',
    icon: 'i-lucide:download',
    gradient: GRADIENTS.download
  },
  {
    key: 'deal',
    title: t('page.home.dealCount'),
    value: 9527,
    prefix: '',
    icon: 'i-lucide:handshake',
    gradient: GRADIENTS.deal
  }
]);
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <div
      v-for="card in cards"
      :key="card.key"
      class="flex items-center gap-4 rounded-lg px-5 py-4 shadow-sm"
      :style="{ backgroundImage: card.gradient }"
    >
      <div class="h-12 w-12 flex-center shrink-0 rounded-md bg-white/20">
        <span class="text-2xl text-white" :class="card.icon" />
      </div>

      <div class="min-w-0 flex flex-col gap-1 text-white">
        <span class="text-sm opacity-90">{{ card.title }}</span>
        <CountTo class="text-2xl font-medium" :value="card.value" :prefix="card.prefix" />
      </div>
    </div>
  </div>
</template>
