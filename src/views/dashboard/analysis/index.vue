<template>
  <div>
    <n-space>
      <n-card v-for="item in cardData" :key="item.title" :title="item.title">
        <template #header-extra>
          <n-tag :type="item.color">{{ item.action }}</n-tag>
        </template>
      </n-card>
    </n-space>
  </div>
</template>

<script lang="ts" setup>
import { NSpace, NCard, NTag } from 'naive-ui';

interface CardData {
  title: string;
  value: number;
  total: number;
  color: 'default' | 'primary' | 'warning' | 'success';
  action: string;
}

const cardData: CardData[] = [
  {
    title: '访问数',
    value: 2000,
    total: 120000,
    color: 'default',
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
