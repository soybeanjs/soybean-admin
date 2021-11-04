<template>
  <shadow-card class="flex-y-center justify-between h-120px p-12px">
    <div class="flex-y-center">
      <img src="@/assets/svg/avatar/avatar01.svg" alt="" class="w-70px h-70px" />
      <div class="pl-12px">
        <h3 class="text-18px font-semibold">早安，{{ auth.userInfo.userName }}, 今天又是充满活力的一天！</h3>
        <p class="leading-30px text-[#999]">今日多云转晴，20℃ - 25℃！</p>
      </div>
    </div>
    <n-space :size="36">
      <n-statistic v-for="item in statisticData" :key="item.id" v-bind="item"></n-statistic>
    </n-space>
  </shadow-card>
</template>

<script setup lang="ts">
import { NSpace, NStatistic } from 'naive-ui';
import { useAuthStore } from '@/store';
import { ShadowCard } from '@/components';

interface StatisticData {
  id: number;
  label: string;
  value: string;
}

const auth = useAuthStore();

const statisticData: StatisticData[] = [
  {
    id: 0,
    label: '经验',
    value: '3年'
  },
  {
    id: 1,
    label: '项目数量',
    value: '10+'
  },
  {
    id: 2,
    label: '主要技术栈',
    value: 'TS,Vue3,React,Nodejs'
  }
];
</script>
<style scoped></style>
