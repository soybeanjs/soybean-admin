<template>
  <div class="absolute-lt w-full h-full overflow-hidden">
    <div class="absolute -right-300px -top-900px">
      <corner-top :start-color="firstColor" :end-color="secondColor" />
    </div>
    <div class="absolute -left-200px -bottom-400px">
      <corner-bottom :start-color="firstColor" :end-color="secondColor" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { brightenColor, darkenColor } from '@/utils';
import { CornerTop, CornerBottom } from './components';

const props = defineProps({
  themeColor: {
    type: String,
    default: '#409EFF'
  }
});

const firstColor = computed(() => darkenColor(props.themeColor));
const secondColor = computed(() => brightenColor(props.themeColor));
</script>
<style scoped></style>
