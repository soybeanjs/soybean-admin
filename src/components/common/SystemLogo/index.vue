<template>
  <div>
    <svg-fill-logo v-if="fill" :color="color" />
    <svg-logo v-else :color="color" />
  </div>
</template>

<script lang="ts" setup>
import { SvgLogo, SvgFillLogo } from './components';

defineProps({
  fill: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: '#409EFF'
  }
});
</script>
<style scoped></style>
