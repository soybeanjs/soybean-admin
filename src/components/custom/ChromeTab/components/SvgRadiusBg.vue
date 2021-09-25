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

const props = defineProps({
  activeColor: {
    type: String,
    default: 'rgba(14,118,226,0.45)' // 修改原色 黑暗模式和亮色模式均可用
  },
  hoverColor: {
    type: String,
    default: 'rgba(51,99,152,0.17)'
  },
  defaultColor: {
    type: String,
    default: 'rgba(14,118,226,0.13)'
  },
  isActive: {
    type: Boolean,
    default: false
  },
  isHover: {
    type: Boolean,
    default: false
  }
});

const fill = computed(() => {
  let color = props.defaultColor;
  if (props.isActive) {
    color = props.activeColor;
  } else if (props.isHover) {
    color = props.hoverColor;
  }
  return color;
});
</script>
<style scoped></style>
