<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { setLocale } from 'ubean/client';
import {
  SAppShell,
  SAvatar,
  SButton,
  SButtonIcon,
  SDropdownMenu,
  SPageTabs,
  SThemeModeSwitch,
  useTheme
} from '@vean/ui';
import type { PageTabsContextMenuOptionData, PageTabsOptionData, PageTabsState } from '@vean/ui';
import { APP_LOCALES, APP_LOCALE_LABELS, APP_TITLE, APP_VERSION } from '@/constants';
import { resolveExternalUrl } from '@/shared/iframe';
import { resolveLayoutMatrix, resolveMenuProps } from '@/shared/layout-matrix';
import { normalizeRoutePath } from '@/shared/route';
import { isTabbableRoute } from '@/shared/tab';
import { registerVeanLocalePack } from '@/shared/vean-locale';
import { toAppRouteMeta } from '@/utils/route-meta';
import { useAppStore, useAuthStore, useMenuStore, useTabStore, useThemeStore } from '@/store';
import { useHydrated } from '@/composables/use-hydrated';
import { env } from '@/env';
import type { AppTab, MenuTreeNode } from '@/typings/app';

/** - 壳模式与 layoutProps 全部来自 `resolveLayoutMatrix()`（P2-20）： 详见 docs/v3-notes.md N-051。 */
const { locale, t } = useI18n();
const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const themeStore = useThemeStore();
const authStore = useAuthStore();
const menuStore = useMenuStore();
const tabStore = useTabStore();

/** 「布局模式 × 设置」矩阵（P2-20） 详见 docs/v3-notes.md N-052。 */
const layoutMatrix = computed(() =>
  resolveLayoutMatrix(themeStore.settings, { isMobile: appStore.isMobile, contentScroll: true })
);

/** 下发给 `SAppShell` 的菜单参数（P2-20 补充） 详见 docs/v3-notes.md N-053。 */
const layoutMatrixMenuProps = computed(() => resolveMenuProps(layoutMatrix.value, { more: t('common.more') }));

/** `SAppShell` 的 `ui` 覆盖 详见 docs/v3-notes.md N-054。 */
const SHELL_UI = { layoutContent: 'p-4' };

/** `SAppShell` 的 `menuUi` 覆盖（`top` 模式顶栏菜单的测量容器） 详见 docs/v3-notes.md N-055。 */
const SHELL_MENU_UI = { treeNav: { overflow: 'group min-w-0' } };

/** 侧栏展开（桌面）/ 抽屉展开（移动）都是 app store 的受控态（P2-13） */
const sidebarOpen = computed({
  get: () => appStore.sidebarOpen,
  set: (value: boolean) => appStore.setSidebarOpen(value)
});

const mobileOpen = computed({
  get: () => appStore.mobileOpen,
  set: (value: boolean) => appStore.setMobileOpen(value)
});

/** 页面转场（P2-15） 详见 docs/v3-notes.md N-056。 */
const pageTransition = computed(() => {
  const { pageAnimate, pageAnimateMode } = themeStore.settings;

  return pageAnimate && pageAnimateMode !== 'none' ? pageAnimateMode : false;
});

// SThemeModeSwitch 是 context 绑定组件（绑 SConfigProvider 主题，无 v-model），
// 这里引用 useTheme 仅保证在 provider 上下文中（提供 consumerName 便于调试）。
useTheme('AppLayout');

/** 出满树，控制台刷 `Hydration node/children mismatch`。这是真 bug 而非噪音： 详见 docs/v3-notes.md N-057。 */
if (env.authRouteMode === 'static' && menuStore.isEmpty) {
  menuStore.initStaticMenu(router);
}

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

/** 当前激活菜单：路由声明了 `activeMenu`（隐藏子菜单指向父菜单）则用它，否则用路由名 */
const activeMenuValue = computed(() => route.meta.activeMenu ?? String(route.name ?? ''));

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

/** 菜单 value → 节点（外链/内嵌页需要 href / iframeUrl，两者都没有 path） */
const menuNodeMap = computed(() => {
  const map = new Map<string, MenuTreeNode>();

  const walk = (nodes: MenuTreeNode[]) => {
    for (const node of nodes) {
      map.set(node.value, node);
      if (node.children) walk(node.children);
    }
  };

  walk(menuStore.items);

  return map;
});

/** 菜单叶子选中 → 跳转（页签由 afterEach 守卫补）。三条通道，优先级： 详见 docs/v3-notes.md N-058。 */
function onMenuSelect(key: string): void {
  const node = menuNodeMap.value.get(key);

  if (node?.href) {
    const href = resolveExternalUrl(node.href);

    if (href) window.open(href, '_blank', 'noopener,noreferrer');
    return;
  }

  if (node?.iframeUrl) {
    const url = resolveExternalUrl(node.iframeUrl);

    if (url) void router.push({ path: '/iframe', query: { url } });
    return;
  }

  const path = menuPathMap.value.get(key);

  // 建树时已剥过 locale 段（见 menu store `initStaticMenu`），这里再兜一次
  // 是防 dynamic 菜单行自带前缀：`/:locale(en)?/...` 这类模板字符串不是地址。
  if (path) void router.push(normalizeRoutePath(path));
}

// ---------------------------------------------------------------------------
// 页签
// ---------------------------------------------------------------------------

/** 是否已完成客户端挂载 详见 docs/v3-notes.md N-059。 */
const hydrated = useHydrated();

/** 页签栏里这条页签还该不该显示 详见 docs/v3-notes.md N-060。 */
function isTabbableTab(tab: AppTab): boolean {
  const record = router.resolve(tab.fullPath).matched.at(-1);

  return !record || isTabbableRoute(toAppRouteMeta(record.meta));
}

/** 页签展示文案同菜单：t(i18nKey) || label */
const shellTabs = computed<PageTabsOptionData[]>(() => {
  if (!hydrated.value || !themeStore.settings.tabVisible) return [];

  return tabStore.tabs.filter(isTabbableTab).map(tab => ({
    value: tab.value,
    label: tab.i18nKey ? t(tab.i18nKey) : tab.label,
    icon: tab.icon,
    pinned: tab.pinned,
    draggable: !tab.pinned
  }));
});

/** 页签激活值变化（SPageTabs 的 `update:tab-value`）→ 切换路由 */
function onTabValueChange(value: unknown): void {
  void tabStore.switchTab(router, String(value));
}

/** 页签点击 → 切换路由 详见 docs/v3-notes.md N-061。 */
function onTabClick(payload: PageTabsOptionData | PointerEvent): void {
  if (typeof payload === 'object' && payload !== null && 'value' in payload) {
    void tabStore.switchTab(router, String(payload.value));
  }
}

/** SPageTabs 的全量回写（close/pin/drag 都走 `update:tabs`）：按 value 对齐应用侧页签（保留 routeName/fullPath），合并。 */
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

/** 页签右键菜单（v2 `TabsDropdown` 的等价物） 详见 docs/v3-notes.md N-063。 */
function tabMenuFactory(tab: PageTabsOptionData, state: PageTabsState): PageTabsContextMenuOptionData[] {
  const reload = () => onTabReload(tab.value);

  return [
    { value: 'reload', label: t('tab.reload'), icon: 'lucide:rotate-cw', action: reload },
    {
      value: 'close',
      label: t('tab.close'),
      icon: 'lucide:x',
      disabled: !state.closable,
      action: state.close
    },
    {
      value: 'close-other',
      label: t('tab.closeOther'),
      disabled: !state.otherClosable,
      action: state.closeOther
    },
    {
      value: 'close-left',
      label: t('tab.closeLeft'),
      disabled: !state.leftClosable,
      action: state.closeLeft
    },
    {
      value: 'close-right',
      label: t('tab.closeRight'),
      disabled: !state.rightClosable,
      action: state.closeRight
    },
    { value: 'close-all', label: t('tab.closeAll'), action: state.closeAll }
  ];
}

/**
 * 右键菜单的「重载」：非当前页签要先切过去再重载，否则 `reloadTab()` 驱逐的是当前页的 keep-alive 缓存，点在别的页签上会重载错页。
 */
async function onTabReload(value: string): Promise<void> {
  const tab = tabStore.tabs.find(item => item.value === value);

  if (!tab) return;

  if (tabStore.activeTabValue !== value) await router.push(tab.fullPath);

  await tabStore.reloadTab(router);
}

// ---------------------------------------------------------------------------
// header 操作区
// ---------------------------------------------------------------------------

const userLabel = computed(() => authStore.userInfo?.fullName || authStore.userInfo?.username || '');

const userAvatarSrc = computed(() => authStore.userInfo?.avatar ?? '');

/** 头像兜底文案 详见 docs/v3-notes.md N-065。 */
const userAvatarFallback = computed(() => {
  const initial = hydrated.value ? userLabel.value.slice(0, 1).toUpperCase() : '';

  return initial || 'U';
});

/** 用户下拉菜单项（`value` 常量与判定分支配对，见 `onUserMenuSelect`） */
const USER_MENU_PROFILE = 'profile';
const USER_MENU_SETTINGS = 'settings';
const USER_MENU_LOGOUT = 'logout';

const userMenuItems = computed(() => [
  { value: USER_MENU_PROFILE, label: t('userCenter.profile.title') },
  { value: USER_MENU_SETTINGS, label: t('userCenter.settings.title') },
  { value: USER_MENU_LOGOUT, label: t('common.logout') }
]);

function onUserMenuSelect(value: unknown): void {
  if (value === USER_MENU_PROFILE) {
    void router.push('/user-center/profile');
    return;
  }

  if (value === USER_MENU_SETTINGS) {
    void router.push('/user-center/settings');
    return;
  }

  if (value === USER_MENU_LOGOUT) void authStore.logout();
}

/**
 * 语言下拉项：直接由 `APP_LOCALES` 派生（新增语言只改常量 + JSON），当前语言置灰（点自己无意义）。
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

/** 切语言：先按需补注册 Vean 组件文案包（`zh` / `en` 是幂等空转，新增语言才真正走动态 `import()`），再调 `setLocale` —— 后者由。 */
async function onLocaleMenuSelect(value: unknown): Promise<void> {
  if (typeof value !== 'string' || value === locale.value) return;

  await registerVeanLocalePack(value);
  await setLocale(value);
}
</script>

<template>
  <SAppShell
    v-model:open="sidebarOpen"
    v-model:mobile-open="mobileOpen"
    :model-value="activeMenuValue"
    :items="shellItems"
    :mode="layoutMatrix.shell"
    v-bind="layoutMatrix.layoutProps"
    :menu-props="layoutMatrixMenuProps"
    :tabs="shellTabs"
    :tab-value="tabStore.activeTabValue"
    expand-strategy="selected"
    :ui="SHELL_UI"
    :menu-ui="SHELL_MENU_UI"
    @select="onMenuSelect"
  >
    <!--
      页签走 `#tabs` 槽而不是 `tabs` prop：页签风格（chrome/card/slider）在样式层`PageTabsProps.variant`，壳的 `tabProps`
      是 `PageTabsCompactProps`，类型上给不到。
      详见 docs/v3-notes.md N-068。
    -->
    <template #tabs>
      <SPageTabs
        v-if="shellTabs.length"
        :items="shellTabs"
        :model-value="tabStore.activeTabValue"
        :variant="themeStore.settings.tabStyle"
        :menu-factory="tabMenuFactory"
        class="h-full grow-1"
        @update:model-value="onTabValueChange"
        @update:items="onTabsUpdate"
        @click="onTabClick"
      />
    </template>
    <template #logo>
      <AppLogo class="size-7" />
    </template>
    <template #title>
      <span class="text-base font-600">{{ APP_TITLE }}</span>
    </template>

    <template #header-end>
      <div class="flex items-center gap-2">
        <SButtonIcon
          icon="lucide:search"
          size="sm"
          variant="ghost"
          :aria-label="t('search.placeholder')"
          @click="appStore.toggleSearch()"
        />
        <SButtonIcon
          icon="lucide:palette"
          size="sm"
          variant="ghost"
          :aria-label="t('theme.settings')"
          @click="appStore.setThemeDrawerVisible(true)"
        />
        <SDropdownMenu :items="localeMenuItems" placement="bottom-end" @select="onLocaleMenuSelect">
          <template #trigger>
            <SButton variant="ghost" size="sm" class="gap-1 px-2" :aria-label="t('common.language')">
              <span class="i-lucide:languages" />
              {{ currentLocaleLabel }}
            </SButton>
          </template>
        </SDropdownMenu>
        <SThemeModeSwitch size="sm" />
        <SDropdownMenu :items="userMenuItems" placement="bottom-end" @select="onUserMenuSelect">
          <template #trigger>
            <SAvatar :src="userAvatarSrc" :fallback-label="userAvatarFallback" size="sm" class="cursor-pointer" />
          </template>
        </SDropdownMenu>
      </div>
    </template>

    <template #footer>
      <div class="flex items-center justify-between gap-4 px-1 py-1 text-xs text-muted-foreground">
        <span>{{ t('app.footer.copyright') }}</span>
        <span>{{ APP_TITLE }} · v{{ APP_VERSION }}</span>
      </div>
    </template>

    <!-- 包一层 `relative` 作为离场页的定位基准：交叉淡出时两个页面同时存在，CSS 会把离场那份移出文档流（见 `src/styles/transition.css`），它需要最近的定位祖 先来确定自己的宽度与上边距。 -->
    <div class="relative">
      <PageView :transition="pageTransition" />
    </div>
  </SAppShell>
</template>
