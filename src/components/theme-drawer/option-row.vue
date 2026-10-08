<script setup lang="ts">
import { computed } from 'vue';
import { SLabel, SSelect } from '@vean/ui';
import { THEME_ROW_CLASS, THEME_SELECT_CLASS } from './shared';
import type { OptionRowProps } from './shared';

defineOptions({ name: 'ThemeDrawerOptionRow' });

const props = withDefaults(defineProps<OptionRowProps>(), {
  disabled: false,
  controlClass: undefined
});

const model = defineModel<string | number>({ required: true });

/** `SSelect` 的 `items` 是可变数组，选项表在常量里是 `readonly`，此处一次性放宽。 */
const selectItems = computed(() => props.items.map(item => ({ ...item })));
</script>

<template>
  <div :class="THEME_ROW_CLASS">
    <SLabel>{{ label }}</SLabel>
    <SSelect v-model="model" :items="selectItems" :disabled="disabled" :class="controlClass ?? THEME_SELECT_CLASS" />
  </div>
</template>
