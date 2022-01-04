<template>
  <div>
    <svg-fill-logo v-if="fill" />
    <svg-logo v-else />
  </div>
</template>

<script lang="ts" setup>
import { SvgLogo, SvgFillLogo } from './components';

interface Props {
  /** logo是否填充 */
  fill?: boolean;
}

withDefaults(defineProps<Props>(), {
  fill: false
});
</script>
<style scoped></style>
