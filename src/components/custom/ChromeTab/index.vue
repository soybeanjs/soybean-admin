<template>
  <div
    class="relative flex-y-center h-34px px-24px cursor-pointer -mr-18px"
    :class="{ 'z-10': isActive, 'z-9': isHover }"
    @mouseenter="setTrue"
    @mouseleave="setFalse"
  >
    <div class="absolute-lb wh-full overflow-hidden">
      <svg-radius-bg
        class="wh-full"
        :is-active="isActive"
        :is-hover="isHover"
        :dark-mode="darkMode"
        :primary-color="primaryColor"
      />
    </div>
    <span class="relative whitespace-nowrap z-2">
      <slot></slot>
    </span>
    <div v-if="closable" class="pl-18px">
      <icon-close :is-primary="isActive" :primary-color="primaryColor" @click="handleClose" />
    </div>
    <n-divider v-if="!isHover && !isActive" :vertical="true" class="absolute right-0 !bg-[#a4abb8] z-2" />
  </div>
</template>

<script setup lang="ts">
import { NDivider } from 'naive-ui';
import { useBoolean } from '@/hooks';
import IconClose from '../IconClose/index.vue';
import { SvgRadiusBg } from './components';

defineProps({
  isActive: {
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
