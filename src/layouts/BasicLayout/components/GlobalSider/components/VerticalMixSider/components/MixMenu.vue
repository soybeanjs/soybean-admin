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
import { ref, watch } from 'vue';
import type { PropType, VNodeChild } from 'vue';
import { useRouter } from 'vue-router';
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
  isActive: {
    type: Boolean,
    default: false
  },
  isMini: {
    type: Boolean,
    default: false
  },
  hoverRoute: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:hoverRoute']);

const router = useRouter();
const { bool: isHover, setTrue, setFalse } = useBoolean();

const hoverRouteName = ref(props.hoverRoute);
function setHoverRouteName(name: string) {
  hoverRouteName.value = name;
}

function handleRouter() {
  router.push({ name: props.routeName });
}

function handleMouseEvent(type: 'enter' | 'leave') {
  if (type === 'enter') {
    setTrue();
    setHoverRouteName(props.routeName);
  } else {
    setFalse();
  }
}

watch(
  () => props.hoverRoute,
  newValue => {
    setHoverRouteName(newValue);
  }
);
watch(hoverRouteName, newValue => {
  emit('update:hoverRoute', newValue);
});
</script>
<style scoped></style>
