<script setup lang="ts">
import { computed, watch } from 'vue';
import { useDateFormat, useNow } from '@vueuse/core';
import { SWatermark } from '@vean/ui';
import { resolveWatermarkContent, shouldRunWatermarkTimer } from '@/shared/watermark';
import { useAuthStore, useThemeStore } from '@/store';

/**
 * 全局水印（P2-12）。
 *
 * `SWatermark` 的 `fullscreen` 把遮罩做成 `fixed inset-0 z-9999 pointer-events-none`，
 * 所以这里挂在应用根部即可，不必包裹内容，也不会挡住交互。水印图由组件内部用
 * canvas 生成 dataURL；`content` 为空串时组件不生成遮罩，等价于关闭。
 *
 * 「实时时间」不是常驻定时器：`shouldRunWatermarkTimer` 为假（未开水印 / 未开时间 /
 * 格式为空）时把 `useNow` 的定时器暂停，省掉一个空转的 interval。
 *
 * `defense` 打开 MutationObserver 自愈：用户用 DevTools 删掉遮罩节点会被重建
 * （v2 的水印右键屏蔽在这里不需要 —— 遮罩本身 `pointer-events-none`）。
 */
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
