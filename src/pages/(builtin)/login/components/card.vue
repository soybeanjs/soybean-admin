<script setup lang="ts">
import { SThemeModeSegment, SCard } from '@vean/ui';
import { APP_TITLE } from '@/constants';
import WaveBg from '@/components/wave-bg.vue';
import type { LoginLayoutProps } from '../shared';
import LoginLayoutSwitcher from './layout-switcher.vue';

/**
 * 登录壳：居中卡片（**本项目原有外观，默认**）。
 *
 * 结构刻意与迁移前逐字一致 —— 默认布局下这次改动对外零视觉差异。
 */
defineOptions({ name: 'LoginLayoutCard' });

defineProps<LoginLayoutProps>();
</script>

<template>
  <div class="relative flex-center size-full overflow-hidden bg-primary-200 dark:bg-primary-300 p-4">
    <WaveBg />

    <div class="absolute top-4 right-4 z-10 flex items-center gap-2">
      <LoginLayoutSwitcher />
      <SThemeModeSegment size="sm" />
    </div>

    <SCard
      size="lg"
      :ui="{
        root: 'relative z-2 w-full max-w-96',
        titleRoot: 'flex-1 justify-center',
        title: 'text-xl'
      }"
    >
      <template #title-leading>
        <AppLogo class="size-8" />
      </template>
      <template #title>{{ APP_TITLE }}</template>

      <h2 class="text-center text-lg font-600 text-primary">{{ title }}</h2>
      <p class="mt-1 mb-6 text-center text-sm text-muted-foreground">{{ description }}</p>

      <slot />
    </SCard>
  </div>
</template>
