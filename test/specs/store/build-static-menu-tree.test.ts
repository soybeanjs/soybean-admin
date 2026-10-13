import { describe, expect, it } from 'vitest';
import { buildMenuTree, findMenuTrail, loadStaticMenus, validateMenuRoutes } from '@/store/modules/menu/shared';
import type { AppMenu, MenuRouteEntry } from '@/store/modules/menu/shared';

/**
 * 菜单建树 / 加载 / 校验的单测（`docs/v3-menu-route-modes.md` §4）。
 *
 * 这三个纯函数是 static（`src/menus/menus.json` + 路由表）与 dynamic
 * （`GET /api/menu/user`）两条路径的**公共收敛点**，所以它们的行为就是两种模式
 * 共同的行为 —— 这里测一遍等于两种模式都测了。
 */

function menu(id: string, partial: Partial<AppMenu> = {}): AppMenu {
  return { id, name: id, code: id, menuType: 'menu', order: 0, ...partial };
}

describe('buildMenuTree', () => {
  const l1 = menu('M_l1', { routeName: 'LevelOneIndex', routePath: '/l1', order: 1 });
  const l2 = menu('M_l2', { parentId: 'M_l1', routeName: 'LevelTwoIndex', routePath: '/l1/l2', order: 2 });
  const l3 = menu('M_l3', { parentId: 'M_l2', routeName: 'LevelThreeIndex', routePath: '/l1/l2/l3', order: 3 });

  it('按 parentId 建出三级嵌套，一级菜单是唯一根节点', () => {
    const tree = buildMenuTree([l3, l1, l2]);

    expect(tree).toHaveLength(1);
    expect(tree[0]?.value).toBe('LevelOneIndex');
    expect(tree[0]?.children?.map(node => node.value)).toEqual(['LevelTwoIndex']);
    expect(tree[0]?.children?.[0]?.children?.map(node => node.value)).toEqual(['LevelThreeIndex']);
  });

  it('叶子节点不产生空的 children 数组', () => {
    expect(buildMenuTree([l1])[0]?.children).toBeUndefined();
  });

  it('同级按 order 升序，子级同样有序（挂父前已排好）', () => {
    const tree = buildMenuTree([
      menu('M_l1', { routeName: 'LevelOneIndex', order: 9 }),
      menu('M_b', { parentId: 'M_l1', routeName: 'BIndex', order: 2 }),
      menu('M_a', { parentId: 'M_l1', routeName: 'AIndex', order: 1 })
    ]);

    expect(tree[0]?.children?.map(node => node.value)).toEqual(['AIndex', 'BIndex']);
  });

  it('parentId 指向不存在的菜单时降级为一级菜单，不丢菜单项', () => {
    const tree = buildMenuTree([l1, menu('M_orphan', { parentId: 'M_not_exist', routeName: 'OrphanIndex', order: 5 })]);

    expect(tree.map(node => node.value)).toEqual(['LevelOneIndex', 'OrphanIndex']);
  });

  it('button / other 不进菜单树，其子项也一并降级为一级', () => {
    const tree = buildMenuTree([
      menu('M_btn', { menuType: 'button' }),
      menu('M_child', { parentId: 'M_btn', routeName: 'ChildIndex', routePath: '/child' })
    ]);

    expect(tree.map(node => node.value)).toEqual(['ChildIndex']);
  });

  it('value 取 routeName，缺 routeName 时回落 code', () => {
    const tree = buildMenuTree([
      menu('M_directory', { menuType: 'directory', code: 'system', name: '系统管理' }),
      menu('M_link', { menuType: 'link', code: 'docs', href: 'https://example.com' })
    ]);

    expect(tree[0]?.value).toBe('system');
    expect(tree[0]?.path).toBeUndefined();
    expect(tree[1]).toMatchObject({ value: 'docs', href: 'https://example.com' });
  });

  it('iframe 菜单把地址给到 iframeUrl 而不是 path', () => {
    const tree = buildMenuTree([menu('M_iframe', { menuType: 'iframe', code: 'embed', iframeUrl: 'https://e.com/a' })]);

    expect(tree[0]?.iframeUrl).toBe('https://e.com/a');
    expect(tree[0]?.path).toBeUndefined();
  });
});

describe('findMenuTrail', () => {
  const tree = buildMenuTree([
    menu('M_l1', { routeName: 'LevelOneIndex', order: 1 }),
    menu('M_l2', { parentId: 'M_l1', routeName: 'LevelTwoIndex', order: 2 }),
    menu('M_l3', { parentId: 'M_l2', routeName: 'LevelThreeIndex', order: 3 })
  ]);

  it('返回根 → 目标节点的完整链路', () => {
    expect(findMenuTrail(tree, 'LevelThreeIndex').map(node => node.value)).toEqual([
      'LevelOneIndex',
      'LevelTwoIndex',
      'LevelThreeIndex'
    ]);
  });

  it('目标不存在时返回空数组', () => {
    expect(findMenuTrail(tree, 'NotExistIndex')).toEqual([]);
  });
});

describe('loadStaticMenus', () => {
  const routes: MenuRouteEntry[] = [
    { name: 'Index', path: '/:locale(en)?/' },
    { name: 'AboutIndex', path: '/:locale(en)?/about' }
  ];

  it('用路由表上的真实 path 覆盖菜单里写的 routePath（并剥掉 locale 段）', () => {
    const menus = loadStaticMenus([menu('M_index', { routeName: 'Index', routePath: '/stale' })], routes);

    expect(menus[0]?.routePath).toBe('/');
  });

  it('路由表里没有该 routeName 时保留菜单写的 routePath（问题交给校验器报出）', () => {
    const menus = loadStaticMenus([menu('M_ghost', { routeName: 'GhostIndex', routePath: '/ghost' })], routes);

    expect(menus[0]?.routePath).toBe('/ghost');
  });

  it('不影响其它字段', () => {
    const menus = loadStaticMenus(
      [menu('M_about', { routeName: 'AboutIndex', routePath: '/about', icon: 'mdi:info', order: 900 })],
      routes
    );

    expect(menus[0]).toMatchObject({ icon: 'mdi:info', order: 900, routePath: '/about' });
  });
});

describe('validateMenuRoutes', () => {
  const routes: MenuRouteEntry[] = [
    { name: 'Index', path: '/:locale(en)?/' },
    { name: 'ManageUserIndex', path: '/:locale(en)?/manage/user' }
  ];

  it('菜单与路由表一致时没有问题', () => {
    const menus = [menu('M_index', { routeName: 'Index', routePath: '/' })];

    expect(validateMenuRoutes(menus, routes)).toEqual([]);
  });

  it('routeName 指向不存在的路由时报出', () => {
    const problems = validateMenuRoutes([menu('M_ghost', { routeName: 'GhostIndex', routePath: '/ghost' })], routes);

    expect(problems).toHaveLength(1);
    expect(problems[0]).toContain('GhostIndex');
  });

  it('菜单路径与路由表路径不一致时报出（locale 前缀不算不一致）', () => {
    const mismatch = validateMenuRoutes(
      [menu('M_user', { routeName: 'ManageUserIndex', routePath: '/manage/user-wrong' })],
      routes
    );
    const matched = validateMenuRoutes(
      [menu('M_user', { routeName: 'ManageUserIndex', routePath: '/manage/user' })],
      routes
    );

    expect(mismatch[0]).toContain('/manage/user');
    expect(matched).toEqual([]);
  });

  it('directory 行的路径必须是子菜单路径的前缀', () => {
    const problems = validateMenuRoutes(
      [
        menu('M_dir', { menuType: 'directory', routePath: '/wrong' }),
        menu('M_child', { parentId: 'M_dir', routeName: 'ManageUserIndex', routePath: '/manage/user' })
      ],
      routes
    );

    expect(problems).toHaveLength(1);
    expect(problems[0]).toContain('前缀');
  });

  it('directory 不查路由表（它本来就没有对应路由）', () => {
    const menus = [
      menu('M_dir', { menuType: 'directory', routePath: '/manage' }),
      menu('M_child', { parentId: 'M_dir', routeName: 'ManageUserIndex', routePath: '/manage/user' })
    ];

    expect(validateMenuRoutes(menus, routes)).toEqual([]);
  });
});
