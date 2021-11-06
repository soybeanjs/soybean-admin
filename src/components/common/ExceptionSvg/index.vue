<template>
  <div class="w-400px h-400px" :style="{ color }">
    <svg-no-permission v-if="type === '403'" />
    <svg-not-found v-if="type === '404'" />
    <svg-service-error v-if="type === '500'" />
  </div>
</template>

<script lang="ts" setup>
import { SvgNoPermission, SvgNotFound, SvgServiceError } from './components';

interface Props {
  /** 异常类型 */
  type?: '403' | '404' | '500';
  /** 主题颜色 */
  color?: string;
}

withDefaults(defineProps<Props>(), {
  type: '404',
  color: '#409eff'
});
</script>
<style scoped></style>
