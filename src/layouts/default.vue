<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { setLocale } from 'ubean/client';
import { SButton, useTheme } from '@vean/ui';
import { APP_TITLE } from '@/constants';
import type { AppLocale } from '@/constants';
import { useAppStore } from '@/store';

/**
 * 默认布局（`ubean.config.ts` 的 `routing.defaultLayout: 'default'`）。
 *
 * Phase 0 只保留「框架出口 + 顶栏」；完整后台壳（侧边菜单 / 标签页 / 面包屑）
 * 走 §5.2 的 `SAppShell` 六模式映射，属于 Phase 2。
 *
 * 出口是 `<PageView />`（ubean 内置组件，自动导入）——布局解析链由 ubean
 * 组装，布局内不要再套 `<RouterView>`。
 *
 * 明暗切换直接驱动 `SConfigProvider` 的主题上下文（`useTheme()`）；
 * `<html class="dark">` 由 provider 自己的 watcher 维护，应用层不碰 DOM。
 */
const { locale, t } = useI18n();
const appStore = useAppStore();

const { effectiveMode, setMode } = useTheme();

const isDark = computed(() => effectiveMode.value === 'dark');

const LOCALE_LABEL: Record<AppLocale, string> = {
  'zh-CN': '中文',
  'en-US': 'EN'
};

/** `setLocale` 来自 `ubean/client`（不是 vue-i18n 的 `useI18n()` 返回值） */
async function toggleLocale(): Promise<void> {
  const next: AppLocale = locale.value === 'zh-CN' ? 'en-US' : 'zh-CN';

  await setLocale(next);
  appStore.setLocaleMirror(next);
}

function toggleColorMode(): void {
  setMode(isDark.value ? 'light' : 'dark');
}
</script>

<template>
  <div class="flex h-full flex-col">
    <header class="flex items-center justify-between gap-4 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
      <div class="flex items-center gap-3">
        <img src="/favicon.svg" alt="logo" class="h-6 w-6" />
        <span class="font-600">{{ APP_TITLE }}</span>
      </div>

      <div class="flex items-center gap-2">
        <SButton size="sm" variant="ghost" @click="toggleLocale">
          {{ LOCALE_LABEL[locale as AppLocale] ?? locale }}
        </SButton>
        <SButton size="sm" variant="ghost" @click="toggleColorMode">
          {{ isDark ? t('common.lightMode') : t('common.darkMode') }}
        </SButton>
      </div>
    </header>

    <main class="flex-1 overflow-auto p-4">
      <PageView />
    </main>
  </div>
</template>
