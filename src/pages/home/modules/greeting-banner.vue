<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { SCard } from '@vean/ui';
import { useAuthStore } from '@/store';

defineOptions({ name: 'HomeGreetingBanner' });

interface StatisticItem {
  key: string;
  title: string;
  value: string;
}

const { t } = useI18n();
const authStore = useAuthStore();

const userName = computed(() => authStore.userInfo?.username ?? '');
const avatarLabel = computed(() => userName.value.slice(0, 1).toUpperCase());

/** 右上角三格统计（P3-01 与 v2 对齐，静态值） */
const statistics = computed<StatisticItem[]>(() => [
  { key: 'project', title: t('page.home.projectCount'), value: '25' },
  { key: 'todo', title: t('page.home.todo'), value: '4/16' },
  { key: 'message', title: t('page.home.message'), value: '12' }
]);
</script>

<template>
  <SCard size="sm">
    <div class="flex flex-wrap items-center gap-x-6 gap-y-4">
      <div class="h-16 w-16 flex-center shrink-0 rounded-full bg-primary text-xl text-white font-medium shadow-sm">
        {{ avatarLabel }}
      </div>

      <div class="min-w-56 flex-1">
        <p class="text-base font-medium">{{ t('page.home.greeting', { userName }) }}</p>
        <p class="mt-1 text-sm text-muted-foreground">{{ t('page.home.weatherDesc') }}</p>
      </div>

      <div class="flex items-center gap-6">
        <div v-for="item in statistics" :key="item.key" class="min-w-16 flex flex-col items-center gap-1">
          <span class="text-xs text-muted-foreground">{{ item.title }}</span>
          <span class="text-lg font-medium">{{ item.value }}</span>
        </div>
      </div>
    </div>
  </SCard>
</template>
