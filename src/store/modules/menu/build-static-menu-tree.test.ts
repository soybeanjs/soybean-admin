import { describe, expect, it, vi } from 'vitest';
import type { AppRouteMeta } from '@/typings/app';
import { buildStaticMenuTree, findMenuTrail } from './index';
import type { StaticMenuRoute } from './index';

/**
 * `buildStaticMenuTree` / `findMenuTrail` 的单测（P3-10 多级菜单）。
 *
 * `initStaticMenu()` 直接把 `getRouter().getRoutes()` 映射成 `StaticMenuRoute[]`
 * 后交给这两个纯函数，所以这里只需喂自定义的路由列表，不必真的建 router。
 */

function route(name: string, path: string, meta: Partial<AppRouteMeta>): StaticMenuRoute {
  return { name, path, meta };
}

const MENU_LEVEL_ONE = route('MultiMenuIndex', '/multi-menu', {
  title: '多级菜单',
  i18nKey: 'route.multiMenu',
  order: 26
});

const MENU_LEVEL_TWO = route('MultiMenuFirstSecondIndex', '/multi-menu/first/second', {
  title: '二级菜单',
  i18nKey: 'route.multiMenuSecond',
  order: 28,
  menuParent: 'MultiMenuIndex'
});

const MENU_LEVEL_TWO_WITH_CHILDREN = route('MultiMenuFirstSecondNewIndex', '/multi-menu/first/second-new', {
  title: '二级菜单（有子菜单）',
  i18nKey: 'route.multiMenuSecondNew',
  order: 29,
  menuParent: 'MultiMenuIndex'
});

const MENU_LEVEL_THREE = route('MultiMenuFirstSecondNewThirdIndex', '/multi-menu/first/second-new/third', {
  title: '三级菜单',
  i18nKey: 'route.multiMenuThird',
  order: 30,
  menuParent: 'MultiMenuFirstSecondNewIndex'
});

describe('buildStaticMenuTree', () => {
  it('按 menuParent 建出三级嵌套，一级菜单是唯一根节点', () => {
    const tree = buildStaticMenuTree([MENU_LEVEL_TWO, MENU_LEVEL_THREE, MENU_LEVEL_ONE, MENU_LEVEL_TWO_WITH_CHILDREN]);

    expect(tree).toHaveLength(1);
    expect(tree[0]?.value).toBe('MultiMenuIndex');
    expect(tree[0]?.children?.map(node => node.value)).toEqual([
      'MultiMenuFirstSecondIndex',
      'MultiMenuFirstSecondNewIndex'
    ]);
    expect(tree[0]?.children?.[1]?.children?.map(node => node.value)).toEqual(['MultiMenuFirstSecondNewThirdIndex']);
  });

  it('叶子节点（一级菜单）不产生空的 children 数组', () => {
    const tree = buildStaticMenuTree([MENU_LEVEL_ONE]);

    expect(tree[0]?.children).toBeUndefined();
  });

  it('同级按 meta.order 排序，子级同样递归排序', () => {
    const tree = buildStaticMenuTree([
      MENU_LEVEL_TWO_WITH_CHILDREN,
      route('MultiMenuFirstSecondIndex', '/multi-menu/first/second', {
        title: '二级菜单',
        order: 28,
        menuParent: 'MultiMenuIndex'
      }),
      route('MultiMenuIndex', '/multi-menu', { title: '多级菜单', order: 26 })
    ]);

    expect(tree[0]?.children?.map(node => node.value)).toEqual([
      'MultiMenuFirstSecondIndex',
      'MultiMenuFirstSecondNewIndex'
    ]);
  });

  it('未声明 menuParent 的路由都升为一级菜单', () => {
    const tree = buildStaticMenuTree([
      route('Index', '/', { title: '工作台', order: 1 }),
      route('ManageApiIndex', '/manage/api', { title: '接口管理', order: 10 })
    ]);

    expect(tree.map(node => node.value)).toEqual(['Index', 'ManageApiIndex']);
  });

  it('menuParent 指向不存在的路由时降级为一级菜单并告警，不丢菜单项', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const tree = buildStaticMenuTree([
      MENU_LEVEL_ONE,
      route('OrphanIndex', '/orphan', { title: '孤儿菜单', order: 40, menuParent: 'NotExistIndex' })
    ]);

    expect(tree.map(node => node.value)).toEqual(['MultiMenuIndex', 'OrphanIndex']);
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0]?.[0]).toContain('NotExistIndex');

    warn.mockRestore();
  });

  it('hideInMenu 的页面不进入菜单树（只靠 activeMenu 让布局高亮）', () => {
    const tree = buildStaticMenuTree([
      MENU_LEVEL_ONE,
      route('MultiMenuFirstIndex', '/multi-menu/first', {
        title: '二级菜单',
        order: 27,
        menuParent: 'MultiMenuIndex'
      }),
      route('MultiMenuFirstHiddenIndex', '/multi-menu/first/hidden', {
        title: '隐藏子页',
        order: 27,
        hideInMenu: true,
        activeMenu: 'MultiMenuFirstIndex'
      })
    ]);

    expect(tree).toHaveLength(1);
    expect(tree[0]?.children?.map(node => node.value)).toEqual(['MultiMenuFirstIndex']);
    expect(tree[0]?.children?.[0]?.children).toBeUndefined();
  });

  it('hideInMenu 的页面即使声明了 menuParent 也不进入菜单树', () => {
    const tree = buildStaticMenuTree([
      MENU_LEVEL_ONE,
      route('HiddenIndex', '/hidden', {
        title: '隐藏页',
        order: 27,
        hideInMenu: true,
        menuParent: 'MultiMenuIndex',
        activeMenu: 'MultiMenuIndex'
      })
    ]);

    expect(tree).toHaveLength(1);
    expect(tree[0]?.value).toBe('MultiMenuIndex');
    expect(tree[0]?.children ?? []).toEqual([]);
  });

  it('过滤掉 hidenInMenu、NotFound 与无名无标题路由', () => {
    const tree = buildStaticMenuTree([
      MENU_LEVEL_ONE,
      route('NotFound', '/:pathMatch(.*)*', { title: '页面不存在' }),
      route('', '/blank', { title: '无路由名' }),
      route('NoTitleIndex', '/no-title', { icon: 'mdi:help' }),
      route('HiddenIndex', '/hidden', { title: '隐藏页', hideInMenu: true })
    ]);

    expect(tree.map(node => node.value)).toEqual(['MultiMenuIndex']);
  });

  it('把 meta 的图标、i18nKey、外链与内嵌地址映射到菜单节点', () => {
    const tree = buildStaticMenuTree([
      route('MultiMenuIndex', '/multi-menu', {
        title: '多级菜单',
        i18nKey: 'route.multiMenu',
        icon: 'mdi:file-tree',
        order: 26
      }),
      route('LinkIndex', '/link', { title: '外链', order: 31, href: 'https://example.com' }),
      route('IframeIndex', '/iframe-demo', { title: '内嵌', order: 32, iframeUrl: 'https://example.com/embed' })
    ]);

    expect(tree[0]).toMatchObject({
      value: 'MultiMenuIndex',
      label: '多级菜单',
      i18nKey: 'route.multiMenu',
      icon: 'mdi:file-tree',
      path: '/multi-menu'
    });
    expect(tree[1]).toMatchObject({ value: 'LinkIndex', href: 'https://example.com' });
    expect(tree[2]).toMatchObject({ value: 'IframeIndex', iframeUrl: 'https://example.com/embed' });
  });
});

describe('findMenuTrail', () => {
  const tree = buildStaticMenuTree([MENU_LEVEL_TWO, MENU_LEVEL_THREE, MENU_LEVEL_ONE, MENU_LEVEL_TWO_WITH_CHILDREN]);

  it('返回根 → 目标节点的完整链路（三级为 3 段）', () => {
    expect(findMenuTrail(tree, 'MultiMenuFirstSecondNewThirdIndex').map(node => node.value)).toEqual([
      'MultiMenuIndex',
      'MultiMenuFirstSecondNewIndex',
      'MultiMenuFirstSecondNewThirdIndex'
    ]);
  });

  it('一级菜单链路长度为 1', () => {
    expect(findMenuTrail(tree, 'MultiMenuIndex')).toHaveLength(1);
  });

  it('目标不存在时返回空数组', () => {
    expect(findMenuTrail(tree, 'NotExistIndex')).toEqual([]);
  });
});
