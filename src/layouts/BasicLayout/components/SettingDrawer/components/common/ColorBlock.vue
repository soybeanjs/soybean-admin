<template>
  <div class="flex-center w-20px h-20px mx-6px mb-8px cursor-pointer rounded-2px" :style="{ backgroundColor: color }">
    <icon-ic-outline-check
      v-if="checked"
      class="text-14px text-white"
      :class="[isWhite ? 'text-gray-700' : 'text-white']"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

interface Props {
  color: string;
  checked?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  checked: false
});

const whiteColors = ['#ffffff', '#fff', 'rgb(255,255,255)'];
const isWhite = computed(() => whiteColors.includes(props.color));
</script>
<style scoped></style>
