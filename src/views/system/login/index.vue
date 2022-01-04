<template>
  <div class="relative flex-center wh-full" :style="{ backgroundColor: bgColor }">
    <n-card :bordered="false" size="large" class="z-20 !w-auto rounded-20px shadow-sm">
      <div class="w-360px">
        <header class="flex-y-center justify-between">
          <div class="w-70px h-70px rounded-35px overflow-hidden">
            <system-logo class="wh-full text-primary" :fill="true" />
          </div>
          <n-gradient-text type="primary" :size="28">{{ title }}</n-gradient-text>
        </header>
        <main class="pt-24px">
          <h3 class="text-18px text-primary font-medium">登录</h3>
        </main>
      </div>
    </n-card>
    <login-bg :theme-color="theme.themeColor" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NCard, NGradientText } from 'naive-ui';
import { SystemLogo } from '@/components';
import { useThemeStore } from '@/store';
import { useAppInfo } from '@/composables';
import { mixColor } from '@/utils';
import { LoginBg } from './components';

const theme = useThemeStore();
const { title } = useAppInfo();

const bgColor = computed(() => {
  const COLOR_WHITE = '#ffffff';
  const darkMode = false;
  const ratio = darkMode ? 0.6 : 0.2;
  return mixColor(COLOR_WHITE, theme.themeColor, ratio);
});
</script>
<style scoped></style>
