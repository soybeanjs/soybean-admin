<template>
  <n-card :bordered="false" class="rounded-16px shadow-sm">
    <div class="flex-y-center justify-between">
      <div class="flex-y-center">
        <img src="@/assets/svg/common/avatar01.svg" alt="" class="w-70px h-70px" />
        <div class="pl-12px">
          <h3 class="text-18px font-semibold">早安，{{ auth.userInfo.userName }}, 今天又是充满活力的一天！</h3>
          <p class="leading-30px text-[#999]">今日多云转晴，20℃ - 25℃！</p>
        </div>
      </div>
      <n-space :size="24" :wrap="false">
        <n-statistic v-for="item in statisticData" :key="item.id" class="whitespace-nowrap" v-bind="item"></n-statistic>
      </n-space>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store';

interface StatisticData {
  id: number;
  label: string;
  value: string;
}

const auth = useAuthStore();

const statisticData: StatisticData[] = [
  {
    id: 0,
    label: '项目数',
    value: '25'
  },
  {
    id: 1,
    label: '待办',
    value: '4/16'
  },
  {
    id: 2,
    label: '消息',
    value: '12'
  }
];
</script>
<style scoped></style>
