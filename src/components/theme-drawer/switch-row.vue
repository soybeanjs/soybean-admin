<script setup lang="ts">
import { SLabel, SSwitch } from '@vean/ui';
import { THEME_ROW_CLASS } from './shared';
import type { SwitchRowProps } from './shared';

defineOptions({ name: 'ThemeDrawerSwitchRow' });

withDefaults(defineProps<SwitchRowProps>(), {
  description: undefined,
  disabled: false,
  labelClass: undefined
});

const model = defineModel<boolean>({ required: true });
</script>

<template>
  <div :class="THEME_ROW_CLASS">
    <div class="min-w-0">
      <SLabel :class="labelClass">{{ label }}</SLabel>
      <p v-if="description" class="text-xs text-muted-foreground">{{ description }}</p>
    </div>
    <SSwitch v-model="model" :disabled="disabled" />
  </div>
</template>
