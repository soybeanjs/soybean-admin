<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { SSelect } from '@vean/ui';
import { DEFAULT_LOGIN_LAYOUT, LOGIN_LAYOUTS } from '@/constants/theme';
import type { LoginLayoutName } from '@/constants/theme';
import { useThemeStore } from '@/store/modules/theme';
import { toSettingValue } from '@/components/theme-drawer/shared';

/**
 * 登录页右上角的外观切换（与主题抽屉 → 通用 → 登录页布局写的是同一份 store 数据）。
 *
 * 独立成组件而不是写进三个壳：三套壳都要这一个下拉，复制三遍会漂移。
 */
defineOptions({ name: 'LoginLayoutSwitcher' });

const { t } = useI18n();
const themeStore = useThemeStore();

const items = computed(() => LOGIN_LAYOUTS.map(item => ({ value: item.value, label: t(item.label) })));

/** 合法候选（`LOGIN_LAYOUTS` 是只读元组，`map` 出来才是 `SSelect` 用得上的可变数组） */
const layoutNames = LOGIN_LAYOUTS.map(item => item.value);

/**
 * 与主题抽屉同一套写法：`SSelect` 的 `v-model` 回传宽的 `string | number`，
 * 经 `toSettingValue` 收窄回字面量联合再写回 store（不用 `as`）。
 */
const layout = computed<LoginLayoutName>({
  get: () => themeStore.settings.loginLayout,
  set: value => themeStore.setThemeSettings({ loginLayout: toSettingValue(value, layoutNames, DEFAULT_LOGIN_LAYOUT) })
});
</script>

<template>
  <SSelect v-model="layout" :items="items" size="sm" class="w-28" />
</template>
