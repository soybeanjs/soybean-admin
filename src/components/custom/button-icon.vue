<script setup lang="ts">
import { createReusableTemplate } from '@vueuse/core';
import type { PopoverPlacement } from 'naive-ui';
import { twMerge } from 'tailwind-merge';

defineOptions({
  name: 'ButtonIcon',
  inheritAttrs: false
});

interface Props {
  /** Button class */
  class?: string;
  /** Iconify icon name */
  icon?: string;
  /** Tooltip content */
  tooltipContent?: string;
  /** Tooltip placement */
  tooltipPlacement?: PopoverPlacement;
  zIndex?: number;
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  icon: '',
  tooltipContent: '',
  tooltipPlacement: 'bottom',
  zIndex: 98
});

const [DefineButton, Button] = createReusableTemplate();

const DEFAULT_CLASS = 'h-[36px] text-icon';
</script>

<template>
  <!-- define component start: Button -->
  <DefineButton v-slot="{ $slots }">
    <NButton quaternary :class="twMerge(DEFAULT_CLASS, props.class)" v-bind="$attrs">
      <div class="flex-center gap-8px">
        <component :is="$slots.default" />
      </div>
    </NButton>
  </DefineButton>
  <!-- define component end: Button -->

  <NTooltip v-if="tooltipContent" :placement="tooltipPlacement" :z-index="zIndex">
    <template #trigger>
      <Button>
        <slot>
          <SvgIcon :icon="icon" />
        </slot>
      </Button>
    </template>
    {{ tooltipContent }}
  </NTooltip>
  <Button v-else>
    <slot>
      <SvgIcon :icon="icon" />
    </slot>
  </Button>
</template>

<style scoped></style>
