<template>
  <div
    class="relative flex-y-center h-34px -mr-20px cursor-pointer"
    :class="{ 'z-10': isHover, 'z-11': isActive }"
    @mouseenter="handleMouseOnTab('enter')"
    @mouseleave="handleMouseOnTab('leave')"
  >
    <div class="relative w-10px h-full">
      <div class="absolute-lt w-full h-full rounded-br-8px overflow-hidden bg-white z-3"></div>
      <div
        class="absolute-rb w-full h-10px z-2 bg-opacity-10"
        :class="{ 'bg-primary': isActive, 'bg-black': !isActive && isHover }"
      ></div>
    </div>
    <div
      class="flex-y-center h-full rounded-t-8px bg-opacity-10"
      :class="{ 'bg-primary': isActive, 'bg-black': !isActive && isHover }"
    >
      <div class="w-16px">
        <n-divider v-if="!isHover && !isActive" :vertical="true" class="!bg-gray-300" />
      </div>
      <span :class="[closable ? 'pr-24px' : 'pr-16px']">
        <slot></slot>
      </span>
      <icon-close v-if="closable" :is-primary="isActive" @click="handleClose" />
      <div v-if="closable" class="w-8px"></div>
    </div>
    <div class="relative w-10px h-full">
      <div class="absolute-lt w-full h-full rounded-bl-8px overflow-hidden bg-white z-3"></div>
      <div
        class="absolute-lb w-full h-10px bg-opacity-10 z-2"
        :class="{ 'bg-primary': isActive, 'bg-black': !isActive && isHover }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { NDivider } from 'naive-ui';
import { useBoolean } from '@/hooks';
import { IconClose } from '../../common';

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

const isActive = computed(() => props.currentIndex === props.activeIndex);

const hoveredIndex = ref(props.hoverIndex);
function setHoverIndex(index: number) {
  hoveredIndex.value = index;
}
function resetHoverIndex() {
  hoveredIndex.value = NaN;
}

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
