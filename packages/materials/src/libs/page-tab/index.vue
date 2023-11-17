<template>
  <component :is="activeTabComponent.component" :class="activeTabComponent.class" :style="cssVars" v-bind="bindProps">
    <template #prefix>
      <slot name="prefix"></slot>
    </template>
    <slot></slot>
    <template #suffix>
      <slot name="suffix">
        <SvgIconClose v-if="closable" :class="[style['icon_close']]" @click="handleClose" />
      </slot>
    </template>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';
import { createTabCssVars, ACTIVE_COLOR } from './shared';
import ChromeTab from './chrome-tab.vue';
import ButtonTab from './button-tab.vue';
import SvgIconClose from './icon-close.vue';
import style from './index.module.css';
import type { PageTabProps, PageTabMode } from '../../types';

defineOptions({
  name: 'PageTab'
});

const props = withDefaults(defineProps<PageTabProps>(), {
  mode: 'chrome',
  commonClass: 'transition-all-300',
  activeColor: ACTIVE_COLOR,
  closable: true
});

interface Emits {
  (e: 'close'): void;
}

const emit = defineEmits<Emits>();

type SlotFn = (props?: Record<string, unknown>) => any;

type Slots = {
  /**
   * slot
   * @description the center content of the tab
   */
  default?: SlotFn;
  /**
   * slot
   * @description the left content of the tab
   */
  prefix?: SlotFn;
  /**
   * slot
   * @description the right content of the tab
   */
  suffix?: SlotFn;
};

defineSlots<Slots>();

const activeTabComponent = computed(() => {
  const { mode, chromeClass, buttonClass } = props;

  const tabComponentMap = {
    chrome: {
      component: ChromeTab,
      class: chromeClass
    },
    button: {
      component: ButtonTab,
      class: buttonClass
    }
  } satisfies Record<PageTabMode, { component: Component; class?: string }>;

  return tabComponentMap[mode];
});

const cssVars = computed(() => createTabCssVars(props.activeColor));

const bindProps = computed(() => {
  const { chromeClass: _chromeCls, buttonClass: _btnCls, ...rest } = props;

  return rest;
});

function handleClose() {
  emit('close');
}
</script>

<style scoped></style>
