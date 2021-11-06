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
import { NTooltip } from 'naive-ui';
import type { FollowerPlacement } from 'vueuc';

interface Props {
  /** 是否显示tooltip */
  showTooltip?: boolean;
  /** tooltip的位置 */
  placement?: FollowerPlacement;
  /** tooltip显示文本 */
  content?: string;
}
withDefaults(defineProps<Props>(), {
  showTooltip: true,
  placement: 'bottom',
  content: ''
});
</script>
<style scoped></style>
