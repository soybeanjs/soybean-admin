<script setup lang="ts">
import { type VNode, computed, useAttrs } from 'vue';
import type { ButtonProps, PopoverPlacement } from 'naive-ui';
import { twMerge } from 'tailwind-merge';

defineOptions({
  name: 'ButtonIcon',
  inheritAttrs: false
});

interface Props {
  /** Button class */
  class?: string;
  /** Show popconfirm icon */
  showPopconfirmIcon?: boolean;
  /** Iconify icon name */
  icon?: string;
  /** Local icon name */
  localIcon?: string;
  /** Tooltip content */
  tooltipContent?: string;
  /** Tooltip placement */
  tooltipPlacement?: PopoverPlacement;
  /** Popconfirm content - can be string or VNode */
  popconfirmContent?: string | VNode;
  zIndex?: number;
  quaternary?: boolean;
  [key: string]: any;
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  showPopconfirmIcon: true,
  icon: '',
  localIcon: '',
  tooltipContent: '',
  tooltipPlacement: 'bottom',
  popconfirmContent: '',
  zIndex: 98,
  quaternary: true
});

interface Emits {
  (e: 'positiveClick'): void;
}

const emit = defineEmits<Emits>();

const DEFAULT_CLASS = 'h-[36px] text-icon';

const attrs: ButtonProps = useAttrs();

const quaternary = computed(() => {
  return !(attrs.text || attrs.dashed || attrs.ghost) && props.quaternary;
});

const handlePositiveClick = () => {
  emit('positiveClick');
};
</script>

<template>
  <NTooltip :placement="tooltipPlacement" :z-index="zIndex" :disabled="!tooltipContent">
    <template #trigger>
      <NPopconfirm :show-icon="showPopconfirmIcon" :disabled="!popconfirmContent" @positive-click="handlePositiveClick">
        <template #default>
          <component :is="popconfirmContent" v-if="typeof popconfirmContent !== 'string'" />
          <template v-else>{{ popconfirmContent }}</template>
        </template>
        <template #trigger>
          <NButton
            :quaternary="quaternary"
            :class="twMerge(DEFAULT_CLASS, props.class)"
            :focusable="false"
            v-bind="attrs"
          >
            <div class="flex-center gap-8px">
              <slot>
                <SvgIcon v-if="icon" :icon="icon" />
                <SvgIcon v-else :local-icon="localIcon" />
              </slot>
            </div>
          </NButton>
        </template>
      </NPopconfirm>
    </template>
    {{ tooltipContent }}
  </NTooltip>
</template>

<style scoped></style>
