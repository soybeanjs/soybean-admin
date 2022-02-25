<template>
  <svg :style="svgStyle" class="svg-icon" aria-hidden="true">
    <use :xlink:href="symbolId" :fill="fill" />
  </svg>
</template>
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  prefix: {
    type: String,
    default: 'icon'
  },
  name: {
    type: String,
    required: true
  },
  size: {
    type: [String, Number],
    default: 30
  },
  color: {
    type: String,
    default: ''
  }
});
const svgStyle = computed(() => {
  const { size } = props;
  let s = `${size}`;
  s = `${s.replace('px', '')}px`;
  return {
    width: s,
    height: s
  };
});
const fill = computed(() => props.color || 'currentColor');
const symbolId = computed(() => `#${props.prefix}-${props.name}`);
</script>
<style scoped>
.svg-icon {
  vertical-align: -0.15em;
  overflow: hidden;
}
</style>
