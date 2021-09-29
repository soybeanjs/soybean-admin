<template>
  <div
    class="mb-6px px-4px cursor-pointer"
    @click="handleRouter"
    @mouseenter="handleMouseEvent('enter')"
    @mouseleave="handleMouseEvent('leave')"
  >
    <div
      class="flex-center flex-col py-12px rounded-2px"
      :class="{ 'text-primary bg-primary bg-opacity-10': isActive, 'text-primary': isHover }"
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
import { useRouter } from 'vue-router';
import { useAppStore } from '@/store';
import { useBoolean } from '@/hooks';
import { useVerticalMixSiderContext } from '@/context';

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

const app = useAppStore();
const router = useRouter();
const { useVerticalMixSiderInject } = useVerticalMixSiderContext();
const { bool: isHover, setTrue, setFalse } = useBoolean();
const { bool: isMouseEnterMenu, setTrue: setMouseEnterMenu, setFalse: setMouseLeaveMenu } = useBoolean();

const { setHoverRouteName, showChildMenu, hideChildMenu, isMouseEnterChildMenu } = useVerticalMixSiderInject();

const isActive = computed(() => props.routeName === props.activeRouteName);

function handleRouter() {
  router.push({ name: props.routeName });
}

async function setActiveHoverRouteName() {
  setTimeout(() => {
    if (app.menu.fixedMix && !isMouseEnterChildMenu.value && !isMouseEnterMenu.value) {
      setHoverRouteName(props.activeRouteName);
    }
    setMouseLeaveMenu();
  }, 100);
}

function handleMouseEvent(type: 'enter' | 'leave') {
  if (type === 'enter') {
    setMouseEnterMenu();
    setTrue();
    setHoverRouteName(props.routeName);
    showChildMenu();
  } else {
    setFalse();
    hideChildMenu();
    setActiveHoverRouteName();
  }
}
</script>
<style scoped></style>
