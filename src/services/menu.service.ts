import { and, count, eq, inArray, like, sql } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
import { AppError } from '@/shared/error';
import { resolveSortColumn } from '@/shared/pagination';
import { createUuidV7 } from '@/shared/uuid';
import type { MenuCreateDTO, MenuQuery, MenuUpdateDTO } from '@/schema/menu';
import { appDb } from '../db';
import { menu, permission } from '../db/schema';
import { permissionService } from './permission.service';

/**
 * 菜单服务（P1-07，unify menu.service 范式）。
 * v3 简化: 路由定义冲突校验保留 routeName/routePath 唯一性；权限码由 permission 服务解析。
 */

export type MenuRow = typeof menu.$inferSelect;
export type MenuTree = MenuRow & { children: MenuRow[] };

const ACTOR = 'admin';

function findMenuById(id: string): MenuRow | undefined {
  const [row] = appDb.select().from(menu).where(eq(menu.id, id)).all();

  return row;
}

function requireMenu(id: string): MenuRow {
  const row = findMenuById(id);

  if (!row) {
    throw new AppError('RESOURCE_NOT_FOUND', '菜单不存在');
  }

  return row;
}

/** 类型约束（v3 简化自 unify validateMenuTypeConstraints） */
function validateMenuTypeConstraints(row: {
  menuType: string;
  routeName: string | null;
  routePath: string | null;
  iframeUrl: string | null;
  href: string | null;
}): void {
  const { menuType, routeName, routePath, iframeUrl, href } = row;

  if (menuType === 'directory') {
    if (routeName || routePath) {
      throw new AppError('PARAM_INVALID', '目录类型菜单不能配置路由');
    }

    return;
  }

  if (menuType === 'menu' || menuType === 'page') {
    if (!routeName || !routePath) {
      throw new AppError('PARAM_INVALID', '菜单/页面类型必须配置路由名称与路由路径');
    }
    if (iframeUrl || href) {
      throw new AppError('PARAM_INVALID', '菜单/页面类型不能配置外链');
    }

    return;
  }

  if (menuType === 'iframe' && !iframeUrl) {
    throw new AppError('PARAM_INVALID', 'iframe 类型必须配置内嵌地址');
  }

  if (menuType === 'link' && !href) {
    throw new AppError('PARAM_INVALID', '外链类型必须配置链接地址');
  }
}

function validateRouteDefinition(routeName: string | null, routePath: string | null, excludeId?: string): void {
  if (routeName) {
    const [dup] = appDb.select().from(menu).where(eq(menu.routeName, routeName)).all();
    if (dup && dup.id !== excludeId) {
      throw new AppError('RESOURCE_EXISTS', '路由名称已存在');
    }
  }
  if (routePath) {
    const [dup] = appDb.select().from(menu).where(eq(menu.routePath, routePath)).all();
    if (dup && dup.id !== excludeId) {
      throw new AppError('RESOURCE_EXISTS', '路由路径已存在');
    }
  }
}

function validateParent(parentId: string | null, selfId?: string): void {
  if (!parentId) return;
  if (selfId && parentId === selfId) {
    throw new AppError('PARAM_INVALID', '父菜单不能是自身');
  }

  requireMenu(parentId);
}

/** 收集后代 id（环检测用） */
function collectDescendantIds(id: string, visited = new Set<string>()): Set<string> {
  visited.add(id);
  const children = appDb.select({ id: menu.id }).from(menu).where(eq(menu.parentId, id)).all();

  children.forEach(child => {
    if (!visited.has(child.id)) {
      collectDescendantIds(child.id, visited);
    }
  });

  return visited;
}

function normalizeValues(dto: Partial<MenuCreateDTO>, current?: MenuRow) {
  return {
    parentId: dto.parentId !== undefined ? dto.parentId : (current?.parentId ?? null),
    menuType: dto.menuType ?? current?.menuType ?? 'menu',
    name: dto.name ?? current?.name ?? '',
    code: dto.code ?? current?.code ?? '',
    requiresAuth: dto.requiresAuth ?? current?.requiresAuth ?? 'Y',
    icon: dto.icon !== undefined ? dto.icon : (current?.icon ?? null),
    i18nKey: dto.i18nKey !== undefined ? dto.i18nKey : (current?.i18nKey ?? null),
    order: dto.order ?? current?.order ?? 999,
    iframeUrl: dto.iframeUrl !== undefined ? dto.iframeUrl : (current?.iframeUrl ?? null),
    href: dto.href !== undefined ? dto.href : (current?.href ?? null),
    keepAlive: dto.keepAlive ?? current?.keepAlive ?? 'N',
    multiTab: dto.multiTab ?? current?.multiTab ?? 'N',
    pinned: dto.pinned ?? current?.pinned ?? 'N',
    routeName: dto.routeName !== undefined ? dto.routeName : (current?.routeName ?? null),
    routePath: dto.routePath !== undefined ? dto.routePath : (current?.routePath ?? null),
    routeLayout: dto.routeLayout !== undefined ? dto.routeLayout : (current?.routeLayout ?? null),
    routeComponent: dto.routeComponent !== undefined ? dto.routeComponent : (current?.routeComponent ?? null),
    routeRedirect: dto.routeRedirect !== undefined ? dto.routeRedirect : (current?.routeRedirect ?? null),
    routeQueries: dto.routeQueries !== undefined ? dto.routeQueries : (current?.routeQueries ?? {}),
    routeParams: dto.routeParams !== undefined ? dto.routeParams : (current?.routeParams ?? {})
  };
}

export const menuService = {
  getMenuList(query: MenuQuery) {
    const conditions: SQL[] = [];

    if (query.menuType) conditions.push(eq(menu.menuType, query.menuType));
    if (query.name) conditions.push(like(menu.name, `%${query.name}%`));
    if (query.code) conditions.push(like(menu.code, `%${query.code}%`));
    if (query.parentId) conditions.push(eq(menu.parentId, query.parentId));
    if (query.requiresAuth) conditions.push(eq(menu.requiresAuth, query.requiresAuth));
    if (query.enabled) conditions.push(eq(menu.enabled, query.enabled));

    const where = conditions.length ? and(...conditions) : undefined;
    const offset = (query.current - 1) * query.size;
    const sort = query.sort ?? '-createdTime';
    const { column: sortColumn, isDesc } = resolveSortColumn(sort, menu, 'createdTime');

    const { total } = appDb.select({ total: count() }).from(menu).where(where).get() ?? { total: 0 };
    const list = appDb
      .select()
      .from(menu)
      .where(where)
      .orderBy(isDesc ? sql`${sortColumn} DESC` : sql`${sortColumn} ASC`)
      .limit(query.size)
      .offset(offset)
      .all();

    return { total, current: query.current, size: query.size, list };
  },

  /** 全量菜单（updatedTime 倒序，管理端树构建用） */
  getMenus(): MenuRow[] {
    return appDb
      .select()
      .from(menu)
      .orderBy(sql`${menu.updatedTime} DESC`)
      .all();
  },

  getMenuById(id: string): MenuRow {
    return requireMenu(id);
  },

  getMenuTree(): MenuTree[] {
    const rows = appDb.select().from(menu).orderBy(menu.order).all();

    return buildMenuTree(rows);
  },

  createMenu(dto: MenuCreateDTO): MenuRow {
    validateParent(dto.parentId ?? null);
    validateMenuTypeConstraints({
      menuType: dto.menuType,
      routeName: dto.routeName ?? null,
      routePath: dto.routePath ?? null,
      iframeUrl: dto.iframeUrl ?? null,
      href: dto.href ?? null
    });
    validateRouteDefinition(dto.routeName ?? null, dto.routePath ?? null);

    const now = new Date().toISOString();
    const row: MenuRow = {
      id: createUuidV7(),
      parentId: dto.parentId ?? null,
      menuType: dto.menuType,
      name: dto.name,
      code: dto.code,
      requiresAuth: dto.requiresAuth ?? 'Y',
      icon: dto.icon ?? null,
      i18nKey: dto.i18nKey ?? null,
      order: dto.order ?? 999,
      iframeUrl: dto.iframeUrl ?? null,
      href: dto.href ?? null,
      routeName: dto.routeName ?? null,
      routePath: dto.routePath ?? null,
      routeLayout: dto.routeLayout ?? null,
      routeComponent: dto.routeComponent ?? null,
      routeRedirect: dto.routeRedirect ?? null,
      routeQueries: dto.routeQueries ?? {},
      routeParams: dto.routeParams ?? {},
      keepAlive: dto.keepAlive ?? 'N',
      multiTab: dto.multiTab ?? 'N',
      pinned: dto.pinned ?? 'N',
      description: null,
      enabled: 'Y',
      createdBy: ACTOR,
      createdTime: now,
      updatedBy: ACTOR,
      updatedTime: now
    };
    appDb.insert(menu).values(row).run();

    return row;
  },

  updateMenu(id: string, dto: MenuUpdateDTO): MenuRow {
    const current = requireMenu(id);
    const next = normalizeValues(dto, current);

    validateParent(next.parentId, id);
    validateMenuTypeConstraints(next);
    validateRouteDefinition(next.routeName, next.routePath, id);

    if (next.parentId) {
      const descendants = collectDescendantIds(id);
      if (descendants.has(next.parentId)) {
        throw new AppError('PARAM_INVALID', '父菜单不能是自身的后代');
      }
    }

    appDb
      .update(menu)
      .set({ ...next, updatedBy: ACTOR, updatedTime: new Date().toISOString() })
      .where(eq(menu.id, id))
      .run();

    return requireMenu(id);
  },

  deleteMenu(id: string): void {
    requireMenu(id);

    const [child] = appDb.select().from(menu).where(eq(menu.parentId, id)).all();
    if (child) {
      throw new AppError('OPERATION_NOT_ALLOWED', '请先删除子菜单');
    }

    appDb
      .delete(permission)
      .where(and(eq(permission.resourceType, 'menu'), eq(permission.resourceId, id)))
      .run();
    appDb.delete(menu).where(eq(menu.id, id)).run();
  },

  batchDeleteMenus(ids: string[]): void {
    if (!ids.length) return;

    const rows = appDb.select().from(menu).where(inArray(menu.id, ids)).all();
    if (rows.length !== ids.length) {
      throw new AppError('RESOURCE_NOT_FOUND', '部分菜单不存在');
    }

    const [child] = appDb.select().from(menu).where(inArray(menu.parentId, ids)).all();
    if (child) {
      throw new AppError('OPERATION_NOT_ALLOWED', '请先删除子菜单');
    }

    appDb
      .delete(permission)
      .where(and(eq(permission.resourceType, 'menu'), inArray(permission.resourceId, ids)))
      .run();
    appDb.delete(menu).where(inArray(menu.id, ids)).run();
  },

  /** 公共路由菜单（无需登录） */
  getPublicMenus(): MenuRow[] {
    const rows = appDb.select().from(menu).where(eq(menu.enabled, 'Y')).all();
    const publicRows = rows.filter(row => row.requiresAuth === 'N');

    return withAncestors(publicRows, rows);
  },

  /** 用户可见路由菜单（登录后按权限授权） */
  getUserMenus(userId: string): MenuRow[] {
    const rows = appDb.select().from(menu).where(eq(menu.enabled, 'Y')).all();

    const authorizedIds = new Set(
      permissionService
        .getUserPermissions(userId)
        .filter(perm => perm.resourceType === 'menu')
        .map(perm => perm.resourceId)
        .filter((id): id is string => Boolean(id))
    );

    const visible = rows.filter(row => row.requiresAuth === 'N' || authorizedIds.has(row.id));

    return withAncestors(visible, rows);
  },

  /** 路由是否存在（前端路由守卫用） */
  isMenuRouteExist(routeName?: string, routePath?: string): boolean {
    if (routeName) {
      const [row] = appDb.select({ id: menu.id }).from(menu).where(eq(menu.routeName, routeName)).all();
      if (row) return true;
    }
    if (routePath) {
      const [row] = appDb.select({ id: menu.id }).from(menu).where(eq(menu.routePath, routePath)).all();
      if (row) return true;
    }

    return false;
  }
};

/** 补齐祖先链（父子关系完整性） */
function withAncestors(visible: MenuRow[], all: MenuRow[]): MenuRow[] {
  const byId = new Map(all.map(row => [row.id, row]));
  const result = new Map(visible.map(row => [row.id, row]));

  visible.forEach(row => {
    let parentId = row.parentId;

    while (parentId) {
      const parent = byId.get(parentId);
      if (!parent || result.has(parent.id)) break;

      result.set(parent.id, parent);
      parentId = parent.parentId;
    }
  });

  return [...result.values()];
}

/** 按 parentId 构建树（order 升序） */
function buildMenuTree(rows: MenuRow[]): MenuTree[] {
  const nodeMap = new Map<string, MenuTree>(rows.map(row => [row.id, { ...row, children: [] }]));
  const roots: MenuTree[] = [];

  rows.forEach(row => {
    const node = nodeMap.get(row.id);
    if (!node) return;

    if (row.parentId && nodeMap.has(row.parentId)) {
      nodeMap.get(row.parentId)?.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}
