<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { setLocale } from 'ubean/client';
import { SAppShell, SAvatar, SButtonIcon, SDropdownMenu, SPageTabs, SThemeModeSwitch, useTheme } from '@vean/ui';
import type { PageTabsContextMenuOptionData, PageTabsOptionData, PageTabsState } from '@vean/ui';
import { APP_LOCALES, APP_LOCALE_LABELS, APP_TITLE, APP_VERSION } from '@/constants';
import { resolveLayoutMatrix } from '@/shared/layout-matrix';
import { registerVeanLocalePack } from '@/shared/vean-locale';
import { useAppStore, useAuthStore, useMenuStore, useTabStore, useThemeStore } from '@/store';
import { getRouter } from '@/router/instance';
import type { AppTab, MenuTreeNode } from '@/typings/app';

/**
 * 默认布局：`SAppShell` 全接线（v3 §5.2 后台壳）。
 *
 * - 菜单/页签标题在此解析 `t(i18nKey) || label`（layout 是 setup 上下文，
 *   切语言后 computed 重算 —— 标题单一来源仍是 i18nKey，store 只存 key）。
 * - 页签状态由 SPageTabs 内部持有并以 `update:tabs` 全量回写
 *   （close/pin/drag/右键菜单都走它），应用侧只做 value 对齐 + pinned 合并。
 *   用 `#tabs` 槽而不是 `tabs` prop 是为了注入 `variant`（页签风格）——
 *   壳的 `tabProps` 类型是 `PageTabsCompactProps`，不含样式层的 `variant`。
 * - 出口是 `<PageView />`（ubean 内置，自带 KeepAlive + 转场），
 *   布局内不要再套 `<RouterView>`；转场名来自主题设置（P2-15）。
 * - 壳模式与 layoutProps 全部来自 `resolveLayoutMatrix()`（P2-20）：
 *   `scrollBehavior: 'content'` 之类需要联动的维度在矩阵里统一裁决，
 *   不在此处写第二份条件分支。
 */
const { locale, t } = useI18n();
const route = useRoute();
const appStore = useAppStore();
const themeStore = useThemeStore();
const authStore = useAuthStore();
const menuStore = useMenuStore();
const tabStore = useTabStore();

/**
 * 「布局模式 × 设置」矩阵（P2-20）。
 *
 * `contentScroll` 传 `true`：内容滚动模式下 `<PageView>` 自带滚动容器，
 * 页脚跟内容一起滚，矩阵据此不再强制关闭 `fixedFooter`。
 */
const layoutMatrix = computed(() =>
  resolveLayoutMatrix(themeStore.settings, { isMobile: appStore.isMobile, contentScroll: true })
);

/** 侧栏展开（桌面）/ 抽屉展开（移动）都是 app store 的受控态（P2-13） */
const sidebarOpen = computed({
  get: () => appStore.sidebarOpen,
  set: (value: boolean) => appStore.setSidebarOpen(value)
});

const mobileOpen = computed({
  get: () => appStore.mobileOpen,
  set: (value: boolean) => appStore.setMobileOpen(value)
});

/**
 * 页面转场（P2-15）。
 *
 * `false` 是「明确关闭」：`PageView` 里 `transition === false` 会短路掉
 * `route.meta.transition` 与全局 `usePageTransition()` 两级兜底，传空串反而会
 * 落回全局值。所以关闭动画只能传 `false`，不能用 `''`。
 */
const pageTransition = computed(() => {
  const { pageAnimate, pageAnimateMode } = themeStore.settings;

  return pageAnimate && pageAnimateMode !== 'none' ? pageAnimateMode : false;
});

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
  if (!themeStore.settings.tabVisible) return [];

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

/**
 * 页签点击 → 切换路由。
 *
 * `SPageTabs` 把 `click` 同时声明成了组件事件（页签数据）和原生事件（根元素），
 * 模板上绑定的处理函数得同时吃下两种参数，所以这里按参数形状分派一次。
 */
function onTabClick(payload: PageTabsOptionData | PointerEvent): void {
  if (typeof payload === 'object' && payload !== null && 'value' in payload) {
    void tabStore.switchTab(String(payload.value));
  }
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

/**
 * 页签右键菜单（v2 `TabsDropdown` 的等价物）。
 *
 * 动作全部走 `PageTabsState` 提供的操作，组件内部照旧把它们汇进
 * `update:items` 回写 —— 应用层不需要为每个动作写一遍 store 调用。
 * 不可用项交给 `disabled`（工具栏显示灰态，和 v2 一致）。
 */
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
 * 右键菜单的「重载」：非当前页签要先切过去再重载，
 * 否则 `reloadTab()` 驱逐的是当前页的 keep-alive 缓存，点在别的页签上会重载错页。
 */
async function onTabReload(value: string): Promise<void> {
  const tab = tabStore.tabs.find(item => item.value === value);

  if (!tab) return;

  if (tabStore.activeTabValue !== value) await getRouter().push(tab.fullPath);

  await tabStore.reloadTab();
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
    v-model:open="sidebarOpen"
    v-model:mobile-open="mobileOpen"
    :model-value="activeMenuValue"
    :items="shellItems"
    :mode="layoutMatrix.shell"
    v-bind="layoutMatrix.layoutProps"
    :tabs="shellTabs"
    :tab-value="tabStore.activeTabValue"
    expand-strategy="selected"
    @select="onMenuSelect"
  >
    <!--
      页签走 `#tabs` 槽而不是 `tabs` prop：页签风格（chrome/card/slider）在样式层
      `PageTabsProps.variant`，壳的 `tabProps` 是 `PageTabsCompactProps`，类型上给不到。
      槽内 SPageTabs 的事件与壳内置版一致（壳也是把 `update:items` 透传成 `update:tabs`），
      这里直接绑到 store，少一层事件转发。
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
      <img src="/favicon.svg" alt="logo" class="size-6" />
    </template>
    <template #title>
      <span class="font-600">{{ APP_TITLE }}</span>
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

    <template #footer>
      <div class="flex items-center justify-between gap-4 px-1 py-1 text-xs text-muted-foreground">
        <span>{{ t('app.footer.copyright') }}</span>
        <span>{{ APP_TITLE }} · v{{ APP_VERSION }}</span>
      </div>
    </template>

    <PageView :transition="pageTransition" />
  </SAppShell>
</template>
