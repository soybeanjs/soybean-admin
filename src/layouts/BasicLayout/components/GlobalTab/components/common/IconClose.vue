<template>
  <div
    class="relative flex-center w-18px h-18px text-14px"
    :class="{ 'text-primary': isPrimary }"
    @mouseenter="setTrue"
    @mouseleave="setFalse"
  >
    <transition name="transition-opacity">
      <icon-carbon-close-filled v-if="isHover" key="hover" class="absolute" />
      <icon-carbon-close v-else key="unhover" class="absolute" />
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { useBoolean } from '@/hooks';

defineProps({
  isPrimary: {
    type: Boolean,
    default: false
  }
});

const { bool: isHover, setTrue, setFalse } = useBoolean();
</script>
<style scoped></style>
