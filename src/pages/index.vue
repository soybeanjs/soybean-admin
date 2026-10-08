<script setup lang="ts">
import HomeCreativityBanner from '@/views/home/modules/creativity-banner.vue';
import HomeGreetingBanner from '@/views/home/modules/greeting-banner.vue';
import HomeLineChart from '@/views/home/modules/line-chart.vue';
import HomePieChart from '@/views/home/modules/pie-chart.vue';
import HomeProjectNews from '@/views/home/modules/project-news.vue';
import HomeStatCards from '@/views/home/modules/stat-cards.vue';

/**
 * 首页工作台（P3-01）：问候横幅 / 4 统计卡 / 折线 + 饼图 / 项目动态 / 创意横幅。
 *
 * 数据全为本地静态 mock（与 v2 对齐，不新增端点）；重模块放 `src/views/home/modules/`
 * （login 页先例），页面只做组合与路由 meta。
 */
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
