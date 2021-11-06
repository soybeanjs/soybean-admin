<template>
  <div :style="{ color }">
    <banner1 v-if="type === '1'" />
    <banner2 v-if="type === '2'" />
    <banner3 v-if="type === '3'" />
  </div>
</template>

<script lang="ts" setup>
import { Banner1, Banner2, Banner3 } from './components';

interface Props {
  /** banner类型 */
  type?: '1' | '2' | '3';
  /** 主题颜色 */
  color?: string;
}

withDefaults(defineProps<Props>(), {
  type: '1',
  color: '#409eff'
});
</script>
<style scoped></style>
