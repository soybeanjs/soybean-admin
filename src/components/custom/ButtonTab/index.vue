<template>
  <div
    class="relative flex-center h-30px pl-14px border-1px rounded-2px cursor-pointer"
    :class="[
      closable ? 'pr-6px' : 'pr-14px',
      active || isHover
        ? 'text-primary border-primary border-opacity-30'
        : darkMode
        ? 'border-[#ffffff3d]'
        : 'border-[#e5e7eb]',
      { 'bg-primary bg-opacity-10': active }
    ]"
    @mouseenter="setTrue"
    @mouseleave="setFalse"
  >
    <span>
      <slot></slot>
    </span>
    <div v-if="closable" class="pl-10px">
      <icon-close :is-primary="active || isHover" @click="handleClose" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useBoolean } from '@/hooks';
import { IconClose } from '@/components';

defineProps({
  active: {
    type: Boolean,
    default: false
  },
  closable: {
    type: Boolean,
    default: true
  },
  darkMode: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['close']);

const { bool: isHover, setTrue, setFalse } = useBoolean();

function handleClose(e: MouseEvent) {
  e.stopPropagation();
  emit('close');
}
</script>
<style scoped></style>
