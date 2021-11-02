<template>
  <n-space :vertical="true" :size="16">
    <n-grid :x-gap="16" :y-gap="16" :item-responsive="true" responsive="screen">
      <n-grid-item span="s:24 m:16">
        <shadow-card class="h-360px"></shadow-card>
      </n-grid-item>
      <n-grid-item span="s:24 m:8">
        <shadow-card class="h-360px"></shadow-card>
      </n-grid-item>
    </n-grid>
    <n-grid cols="s:1 m:2 l:4" responsive="screen" :x-gap="16" :y-gap="16">
      <n-grid-item v-for="item in cardData" :key="item.id">
        <shadow-card class="h-100px">
          <gradient-bg :start-color="item.colors[0]" :end-color="item.colors[1]">
            <h3 class="text-16px">{{ item.title }}</h3>
            <div class="flex justify-between pt-12px">
              <component :is="item.icon" class="text-32px" />
              <count-to
                :prefix="item.unit"
                :start-value="1"
                :end-value="item.value"
                class="text-30px text-white dark:text-dark"
              />
            </div>
          </gradient-bg>
        </shadow-card>
      </n-grid-item>
    </n-grid>
    <n-grid :x-gap="16" :y-gap="16" :item-responsive="true" responsive="screen">
      <n-grid-item span="s:24 m:8">
        <shadow-card class="h-360px"></shadow-card>
      </n-grid-item>
      <n-grid-item span="s:24 m:16">
        <shadow-card class="h-360px"></shadow-card>
      </n-grid-item>
    </n-grid>
  </n-space>
</template>

<script lang="ts" setup>
import type { VNodeChild } from 'vue';
import { NSpace, NGrid, NGridItem } from 'naive-ui';
import { BarChartOutlined, MoneyCollectOutlined, TrademarkOutlined } from '@vicons/antd';
import { DocumentDownload } from '@vicons/carbon';
import { ShadowCard, CountTo } from '@/components';
import { dynamicIconRender } from '@/utils';
import { GradientBg } from './components';

interface CardData {
  id: string;
  title: string;
  value: number;
  unit: string;
  colors: [string, string];
  icon: () => VNodeChild;
}

const cardData: CardData[] = [
  {
    id: 'visit',
    title: '访问量',
    value: 1000000,
    unit: '',
    colors: ['#ec4786', '#b955a4'],
    icon: dynamicIconRender(BarChartOutlined)
  },
  {
    id: 'amount',
    title: '成交额',
    value: 234567.89,
    unit: '$',
    colors: ['#865ec0', '#5144b4'],
    icon: dynamicIconRender(MoneyCollectOutlined)
  },
  {
    id: 'download',
    title: '下载数',
    value: 666666,
    unit: '',
    colors: ['#56cdf3', '#719de3'],
    icon: dynamicIconRender(DocumentDownload)
  },
  {
    id: 'trade',
    title: '成交数',
    value: 999999,
    unit: '',
    colors: ['#fcbc25', '#f68057'],
    icon: dynamicIconRender(TrademarkOutlined)
  }
];
</script>
<style scoped></style>
