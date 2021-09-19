<template>
  <div
    class="
      relative
      inline-flex-center
      h-34px
      px-32px
      transition-background
      duration-400
      ease-in-out
      bg-opacity-10
      cursor-pointer
    "
    :class="{ 'text-primary bg-primary z-3': active, 'bg-black z-2': isHover && !active }"
    @mouseenter="handleMouseOnTab('enter')"
    @mouseleave="handleMouseOnTab('leave')"
  >
    <span>
      <slot></slot>
    </span>
    <div
      v-if="closable"
      class="transition-width duration-400 ease-in-out overflow-hidden"
      :class="[isHover ? 'w-18px' : 'w-0']"
    >
      <icon-close :is-primary="active" @click="handleClose" />
    </div>
    <left-tab-radius
      class="transition-opacity duration-400 ease-in-out"
      :class="[showRadius ? 'opacity-100' : 'opacity-0']"
      :is-primary="active"
      :is-hover="isHover"
      :is-left-hover="isLeftHover"
    />
    <right-tab-radius
      class="transition-opacity duration-400 ease-out"
      :class="[showRadius ? 'opacity-100' : 'opacity-0']"
      :is-primary="active"
      :is-hover="isHover"
      :is-right-hover="isRightHover"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useBoolean } from '@/hooks';
import { IconClose } from '../common';
import { LeftTabRadius, RightTabRadius } from './components';

const props = defineProps({
  currentIndex: {
    type: Number,
    required: true
  },
  activeIndex: {
    type: Number,
    required: true
  },
  hoverIndex: {
    type: Number,
    default: NaN
  },
  closable: {
    type: Boolean,
    default: true
  }
});
const emit = defineEmits(['close', 'update:hoverIndex']);

const { bool: isHover, setTrue, setFalse } = useBoolean();

const hoveredIndex = ref(props.hoverIndex);
function setHoverIndex(index: number) {
  hoveredIndex.value = index;
}
function resetHoverIndex() {
  hoveredIndex.value = NaN;
}

const active = computed(() => props.currentIndex === props.activeIndex);
const showRadius = computed(() => isHover.value || active.value);
const isLeftHover = computed(() => active.value && props.activeIndex === hoveredIndex.value + 1);
const isRightHover = computed(() => active.value && props.activeIndex === hoveredIndex.value - 1);

function handleMouseOnTab(mode: 'enter' | 'leave') {
  if (mode === 'enter') {
    setTrue();
    setHoverIndex(props.currentIndex);
  } else {
    setFalse();
    resetHoverIndex();
  }
}

function handleClose(e: MouseEvent) {
  e.stopPropagation();
  emit('close');
}

watch(
  () => props.hoverIndex,
  newValue => {
    setHoverIndex(newValue);
  }
);
watch(hoveredIndex, newValue => {
  emit('update:hoverIndex', newValue);
});
watch(
  () => props.activeIndex,
  () => {
    resetHoverIndex();
  }
);
</script>
<style scoped></style>
