<script setup lang="ts">
import { watch } from 'vue';
import { useTheme } from '@vean/ui';
import { consumePresetRequest, pendingPresetState } from '@/shared/theme-preset';
import { useThemeStore } from '@/store/modules/theme';

/** 干两件单向同步的事： 详见 docs/v3-notes.md N-041。 */
defineOptions({ name: 'ThemeBridge' });

const theme = useTheme('ThemeBridge');
const themeStore = useThemeStore();

watch(pendingPresetState, state => {
  if (!state) return;

  theme.setThemeState(state);
  consumePresetRequest();
});

/** 信封 → store 的明暗镜像（`immediate` 把 seed 值一并抄回来） */
watch(
  theme.mode,
  value => {
    themeStore.setModePreference(value);
  },
  { immediate: true }
);
</script>

<template>
  <slot />
</template>
