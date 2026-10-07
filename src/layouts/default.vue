<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { setLocale } from 'ubean/client';
import { SAppShell, SAvatar, SDropdownMenu, SThemeModeSwitch, useTheme } from '@vean/ui';
import type { PageTabsOptionData } from '@vean/ui';
import { APP_LOCALES, APP_LOCALE_LABELS, APP_TITLE } from '@/constants';
import { registerVeanLocalePack } from '@/shared/vean-locale';
import { useAuthStore, useMenuStore, useTabStore, useThemeStore } from '@/store';
import { getRouter } from '@/router/instance';
import type { AppTab, MenuTreeNode } from '@/typings/app';

/**
 * 默认布局：`SAppShell` 全接线（v3 §5.2 后台壳）。
 *
 * - 菜单/页签标题在此解析 `t(i18nKey) || label`（layout 是 setup 上下文，
 *   切语言后 computed 重算 —— 标题单一来源仍是 i18nKey，store 只存 key）。
 * - 页签状态由 SPageTabs 内部持有并以 `update:tabs` 全量回写
 *   （close/pin/drag 都走它），应用侧只做 value 对齐 + pinned 合并。
 * - 出口是 `<PageView />`（ubean 内置，自带 KeepAlive + 转场），
 *   布局内不要再套 `<RouterView>`。
 */
const { locale, t } = useI18n();
const route = useRoute();
const themeStore = useThemeStore();
const authStore = useAuthStore();
const menuStore = useMenuStore();
const tabStore = useTabStore();

// SThemeModeSwitch 是 context 绑定组件（绑 SConfigProvider 主题，无 v-model），
// 这里引用 useTheme 仅保证在 provider 上下文中（提供 consumerName 便于调试）。
useTheme('AppLayout');

// ---------------------------------------------------------------------------
// 菜单（i18nKey → 展示文案在此解析）
// ---------------------------------------------------------------------------

/** 递归把菜单树节点翻译成 SAppShell 菜单项 */
function resolveMenuItems(nodes: MenuTreeNode[]): MenuTreeNode[] {
  return nodes.map(node => ({
    ...node,
    label: node.i18nKey ? t(node.i18nKey) : node.label,
    children: node.children ? resolveMenuItems(node.children) : undefined
  }));
}

const shellItems = computed(() => resolveMenuItems(menuStore.items));

/** 当前激活菜单 = 当前路由名（壳据它派生侧栏几何 + 面包屑） */
const activeMenuValue = computed(() => String(route.name ?? ''));

/** 菜单 value → 可导航 path（扁平收集，含子级；store 节点已携带原始 path） */
const menuPathMap = computed(() => {
  const map = new Map<string, string>();

  const walk = (nodes: MenuTreeNode[]) => {
    for (const node of nodes) {
      if (node.path) map.set(node.value, node.path);
      if (node.children) walk(node.children);
    }
  };

  walk(menuStore.items);

  return map;
});

/** 菜单叶子选中 → 按 path 跳转（页签由 afterEach 守卫补）。不按路由名跳：
 * dynamic 模式运行时注册的路由名不在 RouteNamedMap 字面量并集里，
 * `push({ name })` 过不了类型；目录节点本就无可导航 path，忽略即可 */
function onMenuSelect(key: string): void {
  const path = menuPathMap.value.get(key);

  if (path) void getRouter().push(path);
}

// ---------------------------------------------------------------------------
// 页签
// ---------------------------------------------------------------------------

/** 页签展示文案同菜单：t(i18nKey) || label */
const shellTabs = computed<PageTabsOptionData[]>(() => {
  if (!themeStore.layout.tabVisible) return [];

  return tabStore.tabs.map(tab => ({
    value: tab.value,
    label: tab.i18nKey ? t(tab.i18nKey) : tab.label,
    icon: tab.icon,
    pinned: tab.pinned,
    draggable: !tab.pinned
  }));
});

/** 页签激活值变化（SPageTabs 的 `update:tab-value`）→ 切换路由 */
function onTabValueChange(value: unknown): void {
  void tabStore.switchTab(String(value));
}

/** 页签点击（SPageTabs 的 `tab-click`）→ 切换路由 */
function onTabClick(tab: PageTabsOptionData): void {
  void tabStore.switchTab(String(tab.value));
}

/**
 * SPageTabs 的全量回写（close/pin/drag 都走 `update:tabs`）：
 * 按 value 对齐应用侧页签（保留 routeName/fullPath），合并 pinned 变化；
 * 对比回写前后移除的页签，驱逐对应 keep-alive 缓存。
 */
function onTabsUpdate(tabs: PageTabsOptionData[]): void {
  const nextValues = new Set(tabs.map(tab => String(tab.value)));
  const removed = tabStore.tabs.filter(tab => !nextValues.has(tab.value));

  // for 循环收集，避免 map+filter 类型谓词在匿名中间类型上的协变误报
  const nextTabs: AppTab[] = [];

  for (const next of tabs) {
    const existing = tabStore.tabs.find(tab => tab.value === next.value);

    if (existing) {
      nextTabs.push({ ...existing, pinned: next.pinned ?? existing.pinned });
    }
  }

  tabStore.reorderTabs(nextTabs);

  for (const tab of removed) {
    tabStore.evictCacheIfNeeded(tab.routeName);
  }
}

// ---------------------------------------------------------------------------
// header 操作区
// ---------------------------------------------------------------------------

const userLabel = computed(() => authStore.userInfo?.fullName || authStore.userInfo?.username || '');

const userAvatarSrc = computed(() => authStore.userInfo?.avatar ?? '');

/** 用户下拉菜单项（value → 动作） */
const userMenuItems = computed(() => [{ value: 'logout', label: t('common.logout') }]);

function onUserMenuSelect(value: unknown): void {
  if (value === 'logout') void authStore.logout();
}

/**
 * 语言下拉项：直接由 `APP_LOCALES` 派生（新增语言只改常量 + JSON），
 * 当前语言置灰（点自己无意义）。
 */
const localeMenuItems = computed(() =>
  APP_LOCALES.map(code => ({
    value: code,
    label: APP_LOCALE_LABELS[code],
    disabled: code === locale.value
  }))
);

/** 当前语言展示名；未知值原样展示（避免 `as AppLocale` 断言） */
const currentLocaleLabel = computed(() => {
  const current = locale.value;
  const matched = APP_LOCALES.find(code => code === current);

  return matched ? APP_LOCALE_LABELS[matched] : current;
});

/**
 * 切语言：先按需补注册 Vean 组件文案包（`zh` / `en` 是幂等空转，新增语言才真正
 * 走动态 `import()`），再调 `setLocale` —— 后者由 `ubean/client` 负责写 cookie、
 * 懒加载 `src/locales/*.json`、并按 `prefix_except_default` 策略 `router.replace`
 * 到带语言前缀的路径。
 */
async function onLocaleMenuSelect(value: unknown): Promise<void> {
  if (typeof value !== 'string' || value === locale.value) return;

  await registerVeanLocalePack(value);
  await setLocale(value);
}
</script>

<template>
  <SAppShell
    :model-value="activeMenuValue"
    :items="shellItems"
    :mode="themeStore.shellMode"
    :layout-props="themeStore.layoutProps"
    :tabs="shellTabs"
    :tab-value="tabStore.activeTabValue"
    expand-strategy="selected"
    @select="onMenuSelect"
    @update:tab-value="onTabValueChange"
    @tab-click="onTabClick"
    @update:tabs="onTabsUpdate"
  >
    <template #logo>
      <img src="/favicon.svg" alt="logo" class="size-6" />
    </template>
    <template #title>
      <span class="font-600">{{ APP_TITLE }}</span>
    </template>

    <template #header-end>
      <div class="flex items-center gap-2">
        <SDropdownMenu :items="localeMenuItems" placement="bottom-end" @select="onLocaleMenuSelect">
          <template #trigger>
            <button
              type="button"
              class="flex items-center gap-1 rounded px-2 py-1 text-sm hover:bg-current/5"
              :aria-label="t('common.language')"
            >
              <span class="i-lucide:languages" />
              {{ currentLocaleLabel }}
            </button>
          </template>
        </SDropdownMenu>
        <SThemeModeSwitch size="sm" />
        <SDropdownMenu :items="userMenuItems" placement="bottom-end" @select="onUserMenuSelect">
          <template #trigger>
            <SAvatar
              :src="userAvatarSrc"
              :fallback-label="userLabel.slice(0, 1).toUpperCase() || 'U'"
              size="sm"
              class="cursor-pointer"
            />
          </template>
        </SDropdownMenu>
      </div>
    </template>

    <PageView />
  </SAppShell>
</template>
