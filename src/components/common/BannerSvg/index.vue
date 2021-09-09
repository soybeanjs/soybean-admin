<template>
  <div>
    <banner1 v-if="type === '1'" :color="color" />
    <banner2 v-if="type === '2'" :color="color" />
    <banner3 v-if="type === '3'" :color="color" />
    <banner4 v-if="type === '4'" :color="color" />
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { Banner1, Banner2, Banner3, Banner4 } from './components';

defineProps({
  type: {
    type: String as PropType<'1' | '2' | '3' | '4'>,
    default: '1'
  },
  color: {
    type: String,
    required: true
  }
});
</script>
<style scoped></style>
