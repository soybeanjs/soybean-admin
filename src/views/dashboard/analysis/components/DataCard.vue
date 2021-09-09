<template>
  <n-grid cols="1 s:2 m:3 l:4 xl:4 2xl:4" responsive="screen" :x-gap="12" :y-gap="8">
    <n-grid-item v-for="item in cardData" :key="item.title">
      <n-card :title="item.title" :segmented="{ content: true, footer: true }" size="small" :bordered="false">
        <template #header-extra>
          <n-tag :type="item.color">{{ item.action }}</n-tag>
        </template>
        <div class="flex justify-between py-4px px-4px">
          <n-skeleton v-if="loading" :width="100" size="medium" />
          <count-to v-else prefix="$" :start-value="1" :end-value="item.value" class="text-30px" />
        </div>
        <div class="flex justify-between p-8px px-16px">
          <n-skeleton v-if="loading" :width="100" size="medium" />
          <template v-else>
            <span>总{{ item.title }}</span>
            <count-to prefix="$" :start-value="1" :end-value="item.total" />
          </template>
        </div>
      </n-card>
    </n-grid-item>
  </n-grid>
</template>

<script lang="ts" setup>
import { NGrid, NGridItem, NCard, NTag, NSkeleton } from 'naive-ui';
import { CountTo } from '@/components';

interface CardData {
  title: string;
  value: number;
  total: number;
  color: 'default' | 'primary' | 'warning' | 'success' | 'info' | 'error';
  action: string;
}

defineProps({
  loading: {
    type: Boolean,
    required: true
  }
});

const cardData: CardData[] = [
  {
    title: '访问数',
    value: 2000,
    total: 120000,
    color: 'error',
    action: '月'
  },
  {
    title: '成交额',
    value: 20000,
    total: 500000,
    color: 'success',
    action: '月'
  },
  {
    title: '下载数',
    value: 8000,
    total: 120000,
    color: 'primary',
    action: '周'
  },
  {
    title: '成交数',
    value: 5000,
    total: 50000,
    color: 'warning',
    action: '年'
  }
];
</script>
<style scoped></style>
