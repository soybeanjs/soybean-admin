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
    <!-- 修改为50%防止重叠颜色不一致 -->
    <svg width="50%" height="100%">
      <use xlink:href="#geometry-left" width="214" height="36" :fill="fill"></use>
    </svg>
    <g transform="scale(-1, 1)">
      <svg width="50%" height="100%" x="-100%" y="0">
        <use xlink:href="#geometry-right" width="214" height="36" :fill="fill"></use>
      </svg>
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

/** 填充的背景颜色： [默认颜色, 暗黑主题颜色] */
type FillColor = [string, string];

const props = defineProps({
  isActive: {
    type: Boolean,
    default: false
  },
  isHover: {
    type: Boolean,
    default: false
  },
  darkMode: {
    type: Boolean,
    default: false
  }
});

const defaultColor: FillColor = ['#fff', '#18181c'];
const activeColor: FillColor = ['#eef6ff', '#1e3044'];
const hoverColor: FillColor = ['#dee1e6', '#3f3c37'];

const fill = computed(() => {
  const index = Number(props.darkMode);
  let color = defaultColor[index];
  if (props.isActive) {
    color = activeColor[index];
  }
  if (props.isHover) {
    color = hoverColor[index];
  }
  return color;
});
</script>
<style scoped></style>
