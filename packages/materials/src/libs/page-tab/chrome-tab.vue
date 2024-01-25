<script setup lang="ts">
import type { PageTabProps } from '../../types';
import ChromeTabBg from './chrome-tab-bg.vue';
import style from './index.module.css';

defineOptions({
  name: 'ChromeTab'
});

defineProps<PageTabProps>();

type SlotFn = (props?: Record<string, unknown>) => any;

type Slots = {
  /**
   * Slot
   *
   * The center content of the tab
   */
  default?: SlotFn;
  /**
   * Slot
   *
   * The left content of the tab
   */
  prefix?: SlotFn;
  /**
   * Slot
   *
   * The right content of the tab
   */
  suffix?: SlotFn;
};

defineSlots<Slots>();
</script>

<template>
  <div
    class=":soy: relative inline-flex justify-center items-center gap-16px -mr-18px px-24px py-6px cursor-pointer whitespace-nowrap"
    :class="[
      style['chrome-tab'],
      { [style['chrome-tab_dark']]: darkMode },
      { [style['chrome-tab_active']]: active },
      { [style['chrome-tab_active_dark']]: active && darkMode }
    ]"
  >
    <div class=":soy: absolute left-0 top-0 -z-1 w-full h-full pointer-events-none" :class="[style['chrome-tab__bg']]">
      <ChromeTabBg />
    </div>
    <slot name="prefix"></slot>
    <slot></slot>
    <slot name="suffix"></slot>
    <div class=":soy: absolute right-7px w-1px h-16px bg-#1f2225" :class="[style['chrome-tab-divider']]"></div>
  </div>
</template>

<style scoped></style>
