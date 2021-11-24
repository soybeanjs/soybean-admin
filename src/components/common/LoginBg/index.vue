<template>
  <div class="absolute-lt wh-full overflow-hidden">
    <div class="absolute -right-300px -top-900px">
      <corner-top :start-color="themeColor" :end-color="stopColor" />
    </div>
    <div class="absolute -left-200px -bottom-400px">
      <corner-bottom :start-color="themeColor" :end-color="stopColor" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { mixColor } from '@/utils';
import { CornerTop, CornerBottom } from './components';

interface Props {
  /** 主题颜色 */
  themeColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  themeColor: '#409EFF'
});

const COLOR_WHITE = '#ffffff';
const stopColor = computed(() => {
  return mixColor(COLOR_WHITE, props.themeColor, 0.7);
});
</script>
<style scoped></style>
