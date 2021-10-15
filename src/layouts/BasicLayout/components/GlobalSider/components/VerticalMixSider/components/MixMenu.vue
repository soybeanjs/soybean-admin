<template>
  <div class="mb-6px px-4px cursor-pointer" @mouseenter="setTrue" @mouseleave="setFalse">
    <div
      class="flex-center flex-col py-12px rounded-2px"
      :class="{ 'g_text-primary g_bg-primary_active': isActive, 'g_text-primary': isHover }"
    >
      <component :is="icon" :class="[isMini ? 'text-16px' : 'text-20px']" />
      <p
        class="pt-8px text-12px overflow-hidden transition-height duration-200 ease-in-out"
        :class="[isMini ? 'h-0 pt-0' : 'h-20px pt-8px']"
      >
        {{ label }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PropType, VNodeChild } from 'vue';
import { useBoolean } from '@/hooks';

const props = defineProps({
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
  activeRouteName: {
    type: String,
    required: true
  },
  isMini: {
    type: Boolean,
    default: false
  }
});

const { bool: isHover, setTrue, setFalse } = useBoolean();

const isActive = computed(() => props.routeName === props.activeRouteName);
</script>
<style scoped></style>
