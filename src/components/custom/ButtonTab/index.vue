<template>
  <div
    class="
      relative
      flex-center
      h-30px
      pl-14px
      border-1px
      rounded-2px
      cursor-pointer
      border-[#e5e7eb]
      dark:border-[#ffffff3d]
    "
    :class="[closable ? 'pr-6px' : 'pr-14px']"
    :style="buttonStyle"
    @mouseenter="setTrue"
    @mouseleave="setFalse"
  >
    <span>
      <slot></slot>
    </span>
    <div v-if="closable" class="pl-10px">
      <icon-close :is-primary="active || isHover" :primary-color="primaryColor" @click="handleClose" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useBoolean } from '@/hooks';
import { IconClose } from '@/components';
import { shallowColor } from '@/utils';

const props = defineProps({
  active: {
    type: Boolean,
    default: false
  },
  primaryColor: {
    type: String,
    default: '#409EFF'
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

const buttonStyle = computed(() => {
  const style: { [key: string]: string } = {};
  if (props.active || isHover.value) {
    style.color = props.primaryColor;
    style.borderColor = shallowColor(props.primaryColor, 0.3);
    if (props.active) {
      style.backgroundColor = shallowColor(props.primaryColor, 0.1);
    }
  }
  return style;
});
</script>
<style scoped></style>
