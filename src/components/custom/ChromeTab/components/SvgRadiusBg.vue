<template>
  <svg>
    <defs>
      <symbol id="geometry-left" viewBox="0 0 214 36">
        <path d="M17 0h197v36H0v-2c4.5 0 9-3.5 9-8V8c0-4.5 3.5-8 8-8z"></path>
      </symbol>
      <symbol id="geometry-right" viewBox="0 0 214 36">
        <use xlink:href="#geometry-left"></use>
      </symbol>
      <clipPath>
        <rect width="100%" height="100%" x="0"></rect>
      </clipPath>
    </defs>
    <svg width="52%" height="100%">
      <use
        xlink:href="#geometry-left"
        width="214"
        height="36"
        :fill="fill"
        class="transition-fill duration-300 ease-in-out"
      ></use>
    </svg>
    <g transform="scale(-1, 1)">
      <svg width="52%" height="100%" x="-100%" y="0">
        <use
          xlink:href="#geometry-right"
          width="214"
          height="36"
          :fill="fill"
          class="transition-fill duration-300 ease-in-out"
        ></use>
      </svg>
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { mixColor } from '@/utils';

interface Props {
  /** 激活状态 */
  isActive?: boolean;
  /** 鼠标悬浮状态 */
  isHover?: boolean;
  /** 主题颜色 */
  primaryColor?: string;
  /** 暗黑模式 */
  darkMode?: boolean;
}

/** 填充的背景颜色： [默认颜色, 暗黑主题颜色] */
type FillColor = [string, string];

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
  isHover: false,
  primaryColor: '#409EFF',
  darkMode: false
});

const defaultColor: FillColor = ['#fff', '#18181c'];
const hoverColor: FillColor = ['#dee1e6', '#3f3c37'];
const mixColors: FillColor = ['#ffffff', '#000000'];

const fill = computed(() => {
  const index = Number(props.darkMode);
  let color = defaultColor[index];
  if (props.isHover) {
    color = hoverColor[index];
  }
  if (props.isActive) {
    const alpha = props.darkMode ? 0.1 : 0.15;
    color = mixColor(mixColors[index], props.primaryColor, alpha);
  }
  return color;
});
</script>
<style scoped></style>
