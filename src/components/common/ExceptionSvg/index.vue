<template>
  <div class="w-400px h-400px">
    <svg-no-permission v-if="type === '403'" :color="color" />
    <svg-not-found v-if="type === '404'" :color="color" />
    <svg-service-error v-if="type === '500'" :color="color" />
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { SvgNoPermission, SvgNotFound, SvgServiceError } from './components';

defineProps({
  type: {
    type: String as PropType<'403' | '404' | '500'>,
    default: '404'
  },
  color: {
    type: String,
    required: true
  }
});
</script>
<style scoped></style>
