<script setup lang="ts">
import HomeCreativityBanner from '@/pages/home/modules/creativity-banner.vue';
import HomeGreetingBanner from '@/pages/home/modules/greeting-banner.vue';
import HomeLineChart from '@/pages/home/modules/line-chart.vue';
import HomePieChart from '@/pages/home/modules/pie-chart.vue';
import HomeProjectNews from '@/pages/home/modules/project-news.vue';
import HomeStatCards from '@/pages/home/modules/stat-cards.vue';

/** 首页工作台（P3-01）：问候横幅 / 4 统计卡 / 折线 + 饼图 / 项目动态 / 创意横幅 详见 docs/v3-notes.md N-315。 */
definePage({
  meta: {
    title: '工作台',
    i18nKey: 'route.home',
    icon: 'mdi:monitor-dashboard',
    order: 1
  }
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <HomeGreetingBanner />
    <HomeStatCards />

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-5">
      <HomeLineChart class="xl:col-span-3" />
      <HomePieChart class="xl:col-span-2" />
    </div>

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-5">
      <HomeProjectNews class="xl:col-span-3" />
      <HomeCreativityBanner class="xl:col-span-2" />
    </div>
  </div>
</template>
