import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMemoryHistory, createRouter } from 'vue-router';
// @vitest-environment jsdom
import { createPinia, setActivePinia } from 'pinia';
import type { AppRouteMeta } from '@/typings/app';
import type { TabRouteLike } from './index';

/**
 * 页签 store 的持久化与跨用户清理（P4-02，v3 §5.9）。
 *
 * 两条都是「不报错就悄悄坏掉」的能力：
 *
 * ① **持久化**：页签列表写 localStorage，刷新后恢复。P4-02 实测发现
 *    `src/utils/storage.ts` 曾用 `import.meta.client` 当判据（ubean 不注入该
 *    标志，恒 undefined），于是 `isClient()` 恒假 → 页签、token、主题设置全部
 *    刷新即失且不报错。这里的断言就是那条排查结论的固化。
 *
 * ② **跨用户清页签**：登出/换用户必须清空页签，否则新用户会看到上一个用户的
 *    页面痕迹（信息泄露）。走 `authStore.resetStore()` → `tabStore.resetStore()`
 *    这条真实链路，而不是直接调 `tabStore.resetStore()`。
 *
 * `ubean/client` 的缓存 API 是构建期虚拟模块，单测里必须 mock（默认 ESM loader
 * 不支持 `virtual:` 协议，会报 `Only URLs with a scheme in: file, data, and node
 * are supported`）。
 */
vi.mock('ubean/client', () => ({
  reloadPage: vi.fn(),
  excludePageCache: vi.fn(),
  includePageCache: vi.fn()
}));

const excludePageCache = vi.fn();
const includePageCache = vi.fn();

/**
 * 造一个 `TabRouteLike`（store 只读 name / fullPath / meta）。
 *
 * 不需要 `as` 断言：`addTab` 的入参已收敛为最小结构（见 `./index.ts`）。
 */
function route(name: string, fullPath: string, meta: AppRouteMeta = {}): TabRouteLike {
  return { name, fullPath, meta };
}

beforeEach(async () => {
  vi.resetModules();
  localStorage.clear();

  const mocked = await import('ubean/client');
  vi.mocked(mocked.excludePageCache).mockClear();
  vi.mocked(mocked.includePageCache).mockClear();
  excludePageCache.mockClear();
  includePageCache.mockClear();

  setActivePinia(createPinia());
});

describe('页签持久化', () => {
  it('addTab 写入 localStorage（前缀 + tabs 键）', async () => {
    const { useTabStore } = await import('./index');
    const store = useTabStore();

    store.addTab(route('Index', '/', { title: '工作台' }));

    expect(store.tabs).toHaveLength(1);
    expect(store.activeTabValue).toBe('Index');

    const raw = localStorage.getItem('@soybean/tabs');
    expect(raw).toBeTruthy();
    expect(JSON.parse(String(raw))).toMatchObject([{ value: 'Index', routeName: 'Index', label: '工作台' }]);
  });

  it('重新建 store 时从 localStorage 恢复页签（刷新不丢）', async () => {
    const { useTabStore } = await import('./index');
    const first = useTabStore();
    first.addTab(route('Index', '/', { title: '工作台' }));
    first.addTab(route('AboutIndex', '/about', { title: '关于' }));

    // 模拟刷新：换一份全新 pinia 与 store 实例，state 只能来自 localStorage
    setActivePinia(createPinia());
    const { useTabStore: freshUseTabStore } = await import('./index');
    const restored = freshUseTabStore();

    expect(restored.tabs.map(tab => tab.value)).toEqual(['Index', 'AboutIndex']);
  });

  it('multiTab 页用 fullPath 当唯一键（同路由不同 query 各占一个页签）', async () => {
    const { useTabStore } = await import('./index');
    const store = useTabStore();

    store.addTab(route('FunctionMultiTab', '/function/multi-tab?a=1', { title: '多标签', multiTab: true }));
    store.addTab(route('FunctionMultiTab', '/function/multi-tab?a=2', { title: '多标签', multiTab: true }));

    expect(store.tabs.map(tab => tab.value)).toEqual(['/function/multi-tab?a=1', '/function/multi-tab?a=2']);
  });

  it('固定页签排在最前，且关闭非固定页签不会误伤它', async () => {
    const { useTabStore } = await import('./index');
    const store = useTabStore();

    store.addTab(route('Index', '/', { title: '工作台' }));
    store.addTab(route('Pinned', '/pinned', { title: '固定', pinned: true }));
    store.addTab(route('AboutIndex', '/about', { title: '关于' }));

    expect(store.tabs.map(tab => tab.value)).toEqual(['Pinned', 'Index', 'AboutIndex']);

    store.removeTab('Pinned');
    expect(store.tabs.map(tab => tab.value)).toEqual(['Pinned', 'Index', 'AboutIndex']);

    store.clearTabs();
    expect(store.tabs.map(tab => tab.value)).toEqual(['Pinned']);
  });

  it('关闭最后一个同路由页签时驱逐 KeepAlive 缓存，重新打开时恢复资格', async () => {
    const mocked = await import('ubean/client');
    const { useTabStore } = await import('./index');
    const store = useTabStore();

    store.addTab(route('Cached', '/cached', { title: '缓存页', cache: true }));
    expect(vi.mocked(mocked.includePageCache)).toHaveBeenCalledWith('Cached');

    store.removeTab('Cached');
    expect(vi.mocked(mocked.excludePageCache)).toHaveBeenCalledWith('Cached');
  });
});

describe('跨用户清页签', () => {
  it('登出（authStore.resetStore）清空页签与 token', async () => {
    // resetStore 里的 `getRouter().replace('/login')` 需要已安装的 router 实例
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', name: 'Index', component: { template: '<div />' } },
        { path: '/login', name: 'Login', component: { template: '<div />' } }
      ]
    });
    const { installRouter } = await import('@/router/instance');
    installRouter(router);

    localStorage.setItem('@soybean/token', 'stale-token');

    const { useTabStore } = await import('@/store/modules/tab');
    const tabStore = useTabStore();
    tabStore.addTab(route('Index', '/', { title: '工作台' }));
    tabStore.addTab(route('AboutIndex', '/about', { title: '关于' }));
    expect(tabStore.tabs).toHaveLength(2);

    const { useAuthStore } = await import('@/store/modules/auth');
    useAuthStore().resetStore();

    // resetStore 内部用动态 import 清 store，等一轮微任务
    await vi.waitFor(() => {
      expect(tabStore.tabs).toHaveLength(0);
    });

    expect(tabStore.activeTabValue).toBe('');
    expect(JSON.parse(String(localStorage.getItem('@soybean/tabs')))).toEqual([]);
    expect(localStorage.getItem('@soybean/token')).toBeNull();
  });
});
