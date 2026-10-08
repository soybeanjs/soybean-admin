<script setup lang="ts">
import { SInputNumber, SLabel } from '@vean/ui';
import { THEME_ROW_CLASS, fallbackNumber } from './shared';
import type { StepperRowProps } from './shared';

defineOptions({ name: 'ThemeDrawerStepperRow' });

const props = withDefaults(defineProps<StepperRowProps>(), {
  step: 1,
  unit: undefined,
  disabled: false
});

const model = defineModel<number>({ required: true });

/** `SInputNumber` 允许清空（`number | null`），主题设置不接受空值，越界值一并夹回区间。 */
function onValueChange(value: number | null): void {
  model.value = Math.min(Math.max(fallbackNumber(value, props.modelValue), props.min), props.max);
}
</script>

<template>
  <div :class="THEME_ROW_CLASS">
    <div class="flex items-center gap-2">
      <SLabel>{{ label }}</SLabel>
      <span v-if="unit" class="text-xs text-muted-foreground">{{ unit }}</span>
    </div>
    <SInputNumber
      :model-value="model"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      class="w-28"
      @update:model-value="onValueChange"
    />
  </div>
</template>
