<script setup lang="ts">
import { watch } from 'vue';
import { useTheme } from '@vean/ui';
import { consumePresetRequest, pendingPresetState } from '@/shared/theme-preset';
import { useThemeStore } from '@/store/modules/theme';

/**
 * 主题桥（P2-10）—— 必须挂在 `SConfigProvider` **内部**。
 *
 * 干两件单向同步的事：
 *
 * 1. 消费主题抽屉发出的「切预设」请求（`pendingPresetState`）→ `setThemeState()`。
 *    这是唯一同时改生效样式和 `__VEAN_THEME` 信封的入口：抽屉与 provider 的
 *    主题上下文是兄弟关系，拿不到它，只能经这里落地。
 * 2. 把信封里的明暗偏好镜像回 `themeStore.settings.mode`，让「复制配置」输出
 *    完整的 `theme.*` 命名空间。
 *
 * 为什么 provider 不再收应用侧的 `:theme`：`SConfigProvider` 的派生逻辑是
 * `props.theme.base ?? themeState.base`（见 `use-theme.ts` 的 `theme` computed），
 * 传一个 store 派生的响应式对象会让它**永久压过** `SThemeCustomizer` 的编辑 ——
 * 用户在抽屉里换色毫无反应。所以只在 `src/app.ts` 挂载前 `seedPresetState()`
 * 种一次初值，之后真值全在 provider 内部（`persistTheme` 负责持久化）。
 */
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
