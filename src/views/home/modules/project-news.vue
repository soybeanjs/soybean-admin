<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { SCard, SList, SListItem } from '@vean/ui';

defineOptions({ name: 'HomeProjectNews' });

interface NewsItem {
  id: number;
  content: string;
  time: string;
  color: string;
}

const { t } = useI18n();

/** 动态列表与时间沿用 v2 工作台（静态 mock，无接口） */
const newses = computed<NewsItem[]>(() => [
  { id: 1, content: t('page.home.projectNews.desc1'), time: '2021-05-28 22:22:22', color: '#ec4786' },
  { id: 2, content: t('page.home.projectNews.desc2'), time: '2021-10-27 10:24:54', color: '#865ec0' },
  { id: 3, content: t('page.home.projectNews.desc3'), time: '2021-10-31 22:43:12', color: '#56cdf3' },
  { id: 4, content: t('page.home.projectNews.desc4'), time: '2021-11-03 20:33:31', color: '#fcbc25' },
  { id: 5, content: t('page.home.projectNews.desc5'), time: '2021-11-07 22:45:32', color: '#26deca' }
]);
</script>

<template>
  <SCard size="sm" class="h-full" :title="t('page.home.projectNews.title')">
    <template #extra>
      <span class="cursor-pointer text-sm text-primary">{{ t('page.home.projectNews.moreNews') }}</span>
    </template>

    <SList>
      <SListItem v-for="item in newses" :key="item.id" :title="item.content" :description="item.time">
        <template #leading>
          <span class="h-8 w-8 flex-center rounded-full text-xs text-white" :style="{ backgroundColor: item.color }">
            {{ item.id }}
          </span>
        </template>
      </SListItem>
    </SList>
  </SCard>
</template>
