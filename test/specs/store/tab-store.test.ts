import { beforeEach, describe, expect, it, vi } from 'vitest';
// @vitest-environment jsdom
import { createPinia, setActivePinia } from 'pinia';
import type { TabRouteLike } from '@/store/modules/tab';
import type { AppRouteMeta } from '@/typings/app';

/** 两条都是「不报错就悄悄坏掉」的能力： 详见 docs/v3-notes.md N-443。 */
vi.mock('ubean/client', () => ({
  reloadPage: vi.fn(),
  excludePageCache: vi.fn(),
  includePageCache: vi.fn()
}));

const excludePageCache = vi.fn();
const includePageCache = vi.fn();

/** 造一个 `TabRouteLike`（store 只读 name / fullPath / meta）。 */
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
    const { useTabStore } = await import('@/store/modules/tab');
    const store = useTabStore();

    store.addTab(route('Index', '/', { title: '工作台' }));

    expect(store.tabs).toHaveLength(1);
    expect(store.activeTabValue).toBe('Index');

    const raw = localStorage.getItem('@soybean/tabs');
    expect(raw).toBeTruthy();
    expect(JSON.parse(String(raw))).toMatchObject([{ value: 'Index', routeName: 'Index', label: '工作台' }]);
  });

  it('重新建 store 时从 localStorage 恢复页签（刷新不丢）', async () => {
    const { useTabStore } = await import('@/store/modules/tab');
    const first = useTabStore();
    first.addTab(route('Index', '/', { title: '工作台' }));
    first.addTab(route('AboutIndex', '/about', { title: '关于' }));

    // 模拟刷新：换一份全新 pinia 与 store 实例，state 只能来自 localStorage
    setActivePinia(createPinia());
    const { useTabStore: freshUseTabStore } = await import('@/store/modules/tab');
    const restored = freshUseTabStore();

    expect(restored.tabs.map(tab => tab.value)).toEqual(['Index', 'AboutIndex']);
  });

  it('multiTab 页用 fullPath 当唯一键（同路由不同 query 各占一个页签）', async () => {
    const { useTabStore } = await import('@/store/modules/tab');
    const store = useTabStore();

    store.addTab(route('FunctionMultiTab', '/function/multi-tab?a=1', { title: '多标签', multiTab: true }));
    store.addTab(route('FunctionMultiTab', '/function/multi-tab?a=2', { title: '多标签', multiTab: true }));

    expect(store.tabs.map(tab => tab.value)).toEqual(['/function/multi-tab?a=1', '/function/multi-tab?a=2']);
  });

  it('固定页签排在最前，且关闭非固定页签不会误伤它', async () => {
    const { useTabStore } = await import('@/store/modules/tab');
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
    const { useTabStore } = await import('@/store/modules/tab');
    const store = useTabStore();

    store.addTab(route('Cached', '/cached', { title: '缓存页', cache: true }));
    expect(vi.mocked(mocked.includePageCache)).toHaveBeenCalledWith('Cached');

    store.removeTab('Cached');
    expect(vi.mocked(mocked.excludePageCache)).toHaveBeenCalledWith('Cached');
  });

  /** 空白布局的页面不进页签栏 详见 docs/v3-notes.md N-445。 */
  it('blank 布局的路由不进页签（登录页等不渲染后台壳）', async () => {
    const { useTabStore } = await import('@/store/modules/tab');
    const store = useTabStore();

    store.addTab(route('Login', '/login', { title: '登录', layout: 'blank' }));
    expect(store.tabs).toEqual([]);
    expect(store.activeTabValue).toBe('');

    store.addTab(route('Forbidden', '/403', { title: '无访问权限', layout: 'blank' }));
    store.addTab(route('ServiceError', '/500', { title: '服务异常', layout: 'blank' }));
    expect(store.tabs).toEqual([]);

    // 正常页仍然进，且不受影响
    store.addTab(route('Index', '/', { title: '工作台' }));
    expect(store.tabs.map(tab => tab.value)).toEqual(['Index']);
  });

  it('未声明 layout 的路由照常进页签（ubean 默认落在 default 布局）', async () => {
    const { useTabStore } = await import('@/store/modules/tab');
    const store = useTabStore();

    store.addTab(route('AboutIndex', '/about', { title: '关于' }));

    expect(store.tabs.map(tab => tab.value)).toEqual(['AboutIndex']);
  });
});

describe('跨用户清页签', () => {
  it('登出（authStore.resetStore）清空页签与 token', async () => {
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
