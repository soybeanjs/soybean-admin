<script setup lang="ts">
import { computed } from 'vue';

defineOptions({
  name: 'GradientBg'
});

const props = withDefaults(defineProps<Props>(), {
  startColor: '#56cdf3',
  endColor: '#719de3'
});

interface Props {
  startColor?: string;
  endColor?: string;
}

const gradientStyle = computed(() => `linear-gradient(to bottom right, ${props.startColor}, ${props.endColor})`);
</script>

<template>
  <div class="px-16px pt-8px pb-4px rd-8px text-white" :style="{ backgroundImage: gradientStyle }">
    <slot></slot>
  </div>
</template>

<style scoped></style>
