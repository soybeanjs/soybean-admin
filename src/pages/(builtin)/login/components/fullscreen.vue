<script setup lang="ts">
import { SThemeModeSegment, SCard } from '@vean/ui';
import { APP_TITLE } from '@/constants';
import loginBackdrop from '@/assets/login/bg.png';
import type { LoginLayoutProps } from '../shared';
import LoginLayoutSwitcher from './layout-switcher.vue';

/**
 * 登录壳：全屏背景 + 居中玻璃卡。
 *
 * 背景是本项目 primary 变量 + 插画的叠加（`bg-primary-200/300` 打底、插画做低透明度水印），
 * 卡片用 `backdrop-blur` 玻璃质感，与 `card` 壳的实心卡片形成对比。
 */
defineOptions({ name: 'LoginLayoutFullscreen' });

defineProps<LoginLayoutProps>();
</script>

<template>
  <div class="relative flex-center size-full overflow-hidden bg-primary-200 dark:bg-primary-300 p-4">
    <img
      :src="loginBackdrop"
      alt=""
      aria-hidden="true"
      class="absolute inset-0 size-full object-cover opacity-25 mix-blend-luminosity select-none"
    />
    <div class="absolute inset-0 bg-primary-100/40 backdrop-blur-2xl dark:bg-primary-600/30" />

    <div class="absolute top-4 right-4 z-10 flex items-center gap-2">
      <LoginLayoutSwitcher />
      <SThemeModeSegment size="sm" />
    </div>

    <SCard
      size="lg"
      :ui="{
        root: 'relative z-2 w-full max-w-96 border-white/30 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-black/40',
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
