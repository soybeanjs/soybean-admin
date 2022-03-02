<template>
  <svg class="svg-icon" aria-hidden="true">
    <use :xlink:href="symbolId" :fill="fill" />
  </svg>
</template>
<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  /** icon前缀 */
  prefix?: string;
  /** icon 名称 */
  name: string;
  /** 填充颜色 */
  color?: string;
}
const props = withDefaults(defineProps<Props>(), {
  prefix: 'icon',
  name: '',
  color: ''
});
const fill = computed(() => props.color || 'currentColor');
const symbolId = computed(() => `#${props.prefix}-${props.name}`);
</script>
<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  overflow: hidden;
}
</style>
