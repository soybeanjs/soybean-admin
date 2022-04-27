<template>
  <div
    class="dark:(bg-[#18181c] text-white text-opacity-82) transition-all duration-300 ease-in-out"
    :class="invertedClass"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  inverted?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  inverted: false
});

const invertedClass = computed(() => (props.inverted ? 'bg-[#001428] text-white' : 'bg-white text-[#333639]'));
</script>
<style scoped></style>
