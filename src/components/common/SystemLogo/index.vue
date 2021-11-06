<template>
  <div :style="{ color }">
    <svg-fill-logo v-if="fill" />
    <svg-logo v-else />
  </div>
</template>

<script lang="ts" setup>
import { SvgLogo, SvgFillLogo } from './components';

interface Props {
  /** logo是否填充 */
  fill?: boolean;
  /** logo的主题颜色 */
  color?: string;
}

withDefaults(defineProps<Props>(), {
  fill: false,
  color: '#409EFF'
});
</script>
<style scoped></style>
