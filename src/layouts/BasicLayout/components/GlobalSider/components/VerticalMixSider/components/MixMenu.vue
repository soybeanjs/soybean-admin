<template>
  <div class="mb-6px px-4px cursor-pointer">
    <div
      class="flex-center flex-col py-12px rounded-2px"
      :class="{ 'text-primary bg-primary bg-opacity-10': isActive }"
    >
      <component :is="icon" :class="[isMini ? 'text-16px' : 'text-20px']" />
      <p v-show="!isMini" class="pt-8px text-12px">{{ label }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType, VNodeChild } from 'vue';

defineProps({
  routeName: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  icon: {
    type: Function as PropType<() => VNodeChild>,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  isMini: {
    type: Boolean,
    default: false
  }
});
</script>
<style scoped></style>
