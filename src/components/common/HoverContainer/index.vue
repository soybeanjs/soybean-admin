<template>
  <div v-if="showTooltip">
    <n-tooltip :placement="placement" trigger="hover">
      <template #trigger>
        <div class="flex-center h-full cursor-pointer hover:bg-[#f6f6f6] dark:hover:bg-[#333]">
          <slot></slot>
        </div>
      </template>
      {{ content }}
    </n-tooltip>
  </div>
  <div v-else class="flex-center cursor-pointer hover:bg-[#f6f6f6] dark:hover:bg-[#333]">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { NTooltip } from 'naive-ui';
import type { FollowerPlacement } from 'vueuc';

defineProps({
  showTooltip: {
    type: Boolean,
    default: true
  },
  placement: {
    type: String as PropType<FollowerPlacement>,
    default: 'bottom'
  },
  content: {
    type: String,
    default: ''
  }
});
</script>
<style scoped></style>
