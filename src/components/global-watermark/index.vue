<script setup lang="ts">
import { computed, watch } from 'vue';
import { useDateFormat, useNow } from '@vueuse/core';
import { SWatermark } from '@vean/ui';
import { resolveWatermarkContent, shouldRunWatermarkTimer } from '@/shared/watermark';
import { useAuthStore, useThemeStore } from '@/store';

/** 全局水印（P2-12） 详见 docs/v3-notes.md N-036。 */
defineOptions({ name: 'GlobalWatermark' });

const themeStore = useThemeStore();
const authStore = useAuthStore();

const watermark = computed(() => themeStore.settings.watermark);

const { now, pause, resume } = useNow({ controls: true });

/** 格式串做成 getter：`useDateFormat` 内部是 computed，跟着时间格式实时变 */
const timeText = useDateFormat(now, () => watermark.value.timeFormat);

/** 用户名优先于时间（与 v2 一致：两者同时开启展示用户名） */
const userName = computed(() => authStore.userInfo?.fullName || authStore.userInfo?.username || '');

const content = computed(() => resolveWatermarkContent(watermark.value, userName.value, timeText.value));

watch(
  () => shouldRunWatermarkTimer(watermark.value),
  run => {
    if (run) {
      resume();
      return;
    }

    pause();
  },
  { immediate: true }
);
</script>

<template>
  <SWatermark v-if="content" fullscreen :content="content" :gap="[120, 120]" :rotate="-22" :defense="true" />
</template>
