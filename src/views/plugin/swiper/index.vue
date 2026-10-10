<script setup lang="ts">
import { computed, ref } from 'vue';
import { SSegment } from '@vean/ui';
import type { SwiperOptions } from 'swiper/types';
import { Swiper, SwiperSlide } from 'swiper/vue';

/**
 * 轮播示例（P4-01）。
 *
 * 与 v2 的差异：
 * - 只留一个轮播实例 + `SSegment` 切换配置（v2 是 8 张卡竖排，滚动太长）；
 * - `SwiperCore.use` 的全局注册改为组件级 `modules`，避免污染其它页面的 chunk；
 * - `NCard/NSpace` → `SSegment` + UnoCSS；
 * - `v-bind="options"` 会被 Swiper 的 props 类型拒绝（Swiper 的 props 是逐个
 *   声明的，不接受任意对象）→ 显式展开成独立 prop。
 */
defineOptions({ name: 'PluginSwiper' });

interface SwiperExample {
  /** 分段控件上的标签 */
  label: string;
  /** 该配置的一句话说明 */
  description: string;
  options: SwiperOptions;
}

const examples: SwiperExample[] = [
  { label: 'Default', description: '默认配置：一屏一张、间距 20px', options: { slidesPerView: 1, spaceBetween: 20 } },
  {
    label: 'Navigation',
    description: '左右箭头翻页',
    options: { navigation: true, slidesPerView: 1, spaceBetween: 20 }
  },
  {
    label: 'Pagination',
    description: '可点击的分页圆点',
    options: { pagination: { clickable: true }, slidesPerView: 1, spaceBetween: 20 }
  },
  {
    label: 'Dynamic bullets',
    description: '页数多时自动收缩圆点',
    options: { pagination: { dynamicBullets: true }, slidesPerView: 1, spaceBetween: 20 }
  },
  {
    label: 'Progress',
    description: '进度条式分页',
    options: { pagination: { type: 'progressbar' }, slidesPerView: 1, spaceBetween: 20 }
  },
  {
    label: 'Fraction',
    description: '分数式分页（1 / 5）',
    options: { pagination: { type: 'fraction' }, slidesPerView: 1, spaceBetween: 20 }
  },
  { label: 'Slides per view', description: '一屏三张', options: { slidesPerView: 3, spaceBetween: 30 } },
  {
    label: 'Infinite loop',
    description: '无限循环 + 箭头 + 圆点',
    options: { loop: true, navigation: true, pagination: { clickable: true }, slidesPerView: 1, spaceBetween: 20 }
  }
];

/** 分段控件选项：`value` 用下标，`v-model` 直接绑 `activeIndex` */
const segments = examples.map((example, index) => ({ label: example.label, value: index }));

const activeIndex = ref(0);

const activeExample = computed(() => examples[activeIndex.value] ?? examples[0]);

/** Swiper 的 props 是逐个声明的，`v-bind` 整个对象过不了类型检查，拆成独立 prop */
const slidesPerView = computed(() => activeExample.value.options.slidesPerView ?? 1);
const spaceBetween = computed(() => activeExample.value.options.spaceBetween ?? 0);
const navigation = computed(() => Boolean(activeExample.value.options.navigation));
const pagination = computed(() => activeExample.value.options.pagination);
const loop = computed(() => Boolean(activeExample.value.options.loop));
</script>

<template>
  <div class="flex flex-col gap-4">
    <SSegment v-model="activeIndex" :items="segments" class="w-fit" />

    <p class="text-xs opacity-70">{{ activeExample?.description }}</p>

    <Swiper
      :slides-per-view="slidesPerView"
      :space-between="spaceBetween"
      :navigation="navigation"
      :pagination="pagination"
      :loop="loop"
      class="w-full"
    >
      <SwiperSlide v-for="i in 5" :key="i">
        <div
          class="flex h-60 w-full items-center justify-center rounded-md border border-solid border-border text-lg font-bold"
        >
          Slide {{ i }}
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>
