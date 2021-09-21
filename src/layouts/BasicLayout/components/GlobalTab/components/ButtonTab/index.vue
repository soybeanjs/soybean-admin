<template>
  <div
    class="
      inline-flex-center
      h-30px
      px-14px
      bg-white
      border-1px border-[#e5e7eb]
      rounded-2px
      cursor-pointer
      transition
      duration-400
      ease-in-out
    "
    :class="{ 'text-primary bg-primary bg-opacity-10 !border-primary': active, 'text-primary border-primary': isHover }"
    @mouseenter="setTrue"
    @mouseleave="setFalse"
  >
    <span>
      <slot></slot>
    </span>
    <div
      v-if="closable"
      class="overflow-hidden transition-width duration-400 ease-in-out"
      :class="[isHover ? 'w-18px' : 'w-0']"
    >
      <icon-close :is-primary="true" @click="handleClose" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useBoolean } from '@/hooks';
import { IconClose } from '../common';

defineProps({
  active: {
    type: Boolean,
    default: false
  },
  closable: {
    type: Boolean,
    default: true
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
