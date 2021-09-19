<template>
  <div
    class="
      button-tab
      inline-flex-center
      h-34px
      px-14px
      bg-white
      border-1px border-[#e5e7eb]
      rounded-2px
      cursor-pointer
      hover:text-primary hover:border-primary
    "
    :class="{ 'text-primary bg-primary bg-opacity-10 !border-primary': active }"
  >
    <span>
      <slot></slot>
    </span>
    <div v-if="closable" class="icon-close-container w-0 overflow-hidden">
      <icon-close :is-primary="true" @click="handleClose" />
    </div>
  </div>
</template>

<script lang="ts" setup>
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

function handleClose(e: MouseEvent) {
  e.stopPropagation();
  emit('close');
}
</script>
<style scoped lang="scss">
.button-tab {
  transition: all 0.4s ease-out;
  &:hover {
    .icon-close-container {
      width: 18px !important;
    }
  }
  .icon-close-container {
    transition: width 0.4s ease-out;
  }
}
</style>
