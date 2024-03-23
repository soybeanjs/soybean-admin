<script setup lang="ts">
import { computed } from 'vue';
import { createReusableTemplate } from '@vueuse/core';
import type { PopoverPlacement } from 'naive-ui';

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
}

const props = withDefaults(defineProps<Props>(), {
  class: 'h-36px text-icon',
  icon: '',
  tooltipContent: '',
  tooltipPlacement: 'bottom'
});

interface ButtonProps {
  className: string;
}

const [DefineButton, Button] = createReusableTemplate<ButtonProps>();

const cls = computed(() => {
  let clsStr = props.class;

  if (!clsStr.includes('h-')) {
    clsStr += ' h-36px';
  }

  if (!clsStr.includes('text-')) {
    clsStr += ' text-icon';
  }

  return clsStr;
});
</script>

<template>
  <!-- define component start: Button -->
  <DefineButton v-slot="{ $slots, className }">
    <NButton quaternary :class="className">
      <div class="flex-center gap-8px">
        <component :is="$slots.default" />
      </div>
    </NButton>
  </DefineButton>
  <!-- define component end: Button -->

  <NTooltip v-if="tooltipContent" :placement="tooltipPlacement" :z-index="98">
    <template #trigger>
      <Button :class-name="cls" v-bind="$attrs">
        <slot>
          <SvgIcon :icon="icon" />
        </slot>
      </Button>
    </template>
    {{ tooltipContent }}
  </NTooltip>
  <Button v-else :class-name="cls" v-bind="$attrs">
    <slot>
      <SvgIcon :icon="icon" />
    </slot>
  </Button>
</template>

<style scoped></style>
