import { and, count, eq, inArray, like, or, sql } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
import { AppError } from '@/shared/error';
import { resolveSortColumn } from '@/shared/pagination';
import { createUuidV7 } from '@/shared/uuid';
import type { PermissionCreateDTO, PermissionQuery, PermissionUpdateDTO } from '@/schema/permission';
import { appDb } from '../db';
import { api, menu, permission, rolePermission, userRole } from '../db/schema';

/**
 * 权限服务（P1-07，unify permission.service 范式）。
 *
 * 权限码约定（P1-06 RBAC）:
 * - API 权限码: `api:${method.toLowerCase()}:(path)`（与中间件生成的权限码一致）
 * - 菜单权限码: `menu:${menuType}:${code}`
 * - 其他: 直接用录入的 code
 */

export type PermissionRecord = typeof permission.$inferSelect;

function resolveResourceBinding(
  resourceType: string,
  resourceId: string | null | undefined
): { name: string; code: string } | undefined {
  if (resourceType === 'other') {
    return undefined;
  }

  if (resourceType === 'api') {
    if (!resourceId) {
      throw new AppError('PARAM_INVALID', '接口权限必须提供 resourceId');
    }
    const [apiRow] = appDb.select().from(api).where(eq(api.id, resourceId)).all();
    if (!apiRow) {
      throw new AppError('RESOURCE_NOT_FOUND', '接口不存在');
    }

    return { name: `接口:${apiRow.name}`, code: `api:${apiRow.method.toLowerCase()}:(${apiRow.path})` };
  }

  if (resourceType === 'menu') {
    if (!resourceId) {
      throw new AppError('PARAM_INVALID', '菜单权限必须提供 resourceId');
    }
    const [menuRow] = appDb.select().from(menu).where(eq(menu.id, resourceId)).all();
    if (!menuRow) {
      throw new AppError('RESOURCE_NOT_FOUND', '菜单不存在');
    }

    return { name: `菜单:${menuRow.name}`, code: `menu:${menuRow.menuType}:${menuRow.code}` };
  }

  throw new AppError('PARAM_INVALID', `不支持的权限资源类型: ${resourceType}`);
}

export const permissionService = {
  getPermissionList(query: PermissionQuery) {
    const conditions: SQL[] = [];

    if (query.name) conditions.push(like(permission.name, `%${query.name}%`));
    if (query.code) conditions.push(like(permission.code, `%${query.code}%`));
    if (query.resourceType) conditions.push(eq(permission.resourceType, query.resourceType));
    if (query.enabled) conditions.push(eq(permission.enabled, query.enabled));

    const where = conditions.length ? and(...conditions) : undefined;
    const offset = (query.current - 1) * query.size;
    const { column: sortColumn, isDesc } = resolveSortColumn(query.sort, permission, 'createdTime');

    const { total } = appDb.select({ total: count() }).from(permission).where(where).get() ?? { total: 0 };
    const list = appDb
      .select()
      .from(permission)
      .where(where)
      .orderBy(isDesc ? sql`${sortColumn} DESC` : sql`${sortColumn} ASC`)
      .limit(query.size)
      .offset(offset)
      .all();

    return { total, current: query.current, size: query.size, list };
  },

  getAllPermissions() {
    return appDb.select().from(permission).orderBy(permission.name, permission.code).all();
  },

  getPermissionById(id: string): PermissionRecord {
    const [row] = appDb.select().from(permission).where(eq(permission.id, id)).all();

    if (!row) {
      throw new AppError('RESOURCE_NOT_FOUND', '权限不存在');
    }

    return row;
  },

  getPermissionByCode(code: string): PermissionRecord | undefined {
    const [row] = appDb.select().from(permission).where(eq(permission.code, code)).all();

    return row;
  },

  createPermission(dto: PermissionCreateDTO): PermissionRecord {
    const binding = resolveResourceBinding(dto.resourceType ?? 'other', dto.resourceId);
    const name = binding?.name ?? dto.name;
    const code = binding?.code ?? dto.code;

    if (!name || !code) {
      throw new AppError('PARAM_INVALID', '权限名称与编码不能为空');
    }
    if (this.getPermissionByCode(code)) {
      throw new AppError('RESOURCE_EXISTS', '权限编码已存在');
    }

    const now = new Date().toISOString();
    const row: PermissionRecord = {
      id: createUuidV7(),
      name,
      code,
      resourceType: dto.resourceType ?? 'other',
      resourceId: dto.resourceId ?? null,
      description: dto.description ?? null,
      enabled: 'Y',
      createdBy: 'admin',
      createdTime: now,
      updatedBy: 'admin',
      updatedTime: now
    };

    appDb.insert(permission).values(row).run();

    return row;
  },

  updatePermission(id: string, dto: PermissionUpdateDTO): PermissionRecord {
    const current = this.getPermissionById(id);
    const nextType = dto.resourceType ?? current.resourceType;
    const nextResourceId = dto.resourceId !== undefined ? dto.resourceId : current.resourceId;
    const binding = resolveResourceBinding(nextType, nextResourceId);
    const nextName = binding?.name ?? dto.name ?? current.name;
    const nextCode = binding?.code ?? dto.code ?? current.code;

    if (nextCode !== current.code && this.getPermissionByCode(nextCode)) {
      throw new AppError('RESOURCE_EXISTS', '权限编码已存在');
    }

    appDb
      .update(permission)
      .set({
        name: nextName,
        code: nextCode,
        resourceType: nextType,
        resourceId: nextResourceId ?? null,
        description: dto.description !== undefined ? dto.description : current.description,
        updatedBy: 'admin',
        updatedTime: new Date().toISOString()
      })
      .where(eq(permission.id, id))
      .run();

    return this.getPermissionById(id);
  },

  deletePermission(id: string): void {
    this.getPermissionById(id);
    appDb.delete(rolePermission).where(eq(rolePermission.permissionId, id)).run();
    appDb.delete(permission).where(eq(permission.id, id)).run();
  },

  batchDeletePermissions(ids: string[]): void {
    if (!ids.length) return;
    appDb.delete(rolePermission).where(inArray(rolePermission.permissionId, ids)).run();
    appDb.delete(permission).where(inArray(permission.id, ids)).run();
  },

  getRolePermissions(roleId: string) {
    return appDb
      .select({ permission })
      .from(rolePermission)
      .innerJoin(permission, eq(rolePermission.permissionId, permission.id))
      .where(eq(rolePermission.roleId, roleId))
      .all()
      .map(row => row.permission);
  },

  /** 用户是否拥有某权限码（RBAC 中间件核心查询） */
  checkUserHasPermission(userId: string, code: string): boolean {
    const [perm] = appDb.select().from(permission).where(eq(permission.code, code)).all();
    if (!perm) return false;

    const userRoles = appDb.select({ roleId: userRole.roleId }).from(userRole).where(eq(userRole.userId, userId)).all();
    if (!userRoles.length) return false;

    const roleIds = userRoles.map(row => row.roleId);
    const [link] = appDb
      .select()
      .from(rolePermission)
      .where(and(inArray(rolePermission.roleId, roleIds), eq(rolePermission.permissionId, perm.id)))
      .all();

    return Boolean(link);
  },

  /** 用户全量权限码集合（去重） */
  getUserPermissionCodes(userId: string): string[] {
    const userRoles = appDb.select({ roleId: userRole.roleId }).from(userRole).where(eq(userRole.userId, userId)).all();
    if (!userRoles.length) return [];

    const roleIds = userRoles.map(row => row.roleId);
    const rows = appDb
      .select({ code: permission.code })
      .from(rolePermission)
      .innerJoin(permission, eq(rolePermission.permissionId, permission.id))
      .where(inArray(rolePermission.roleId, roleIds))
      .all();

    return [...new Set(rows.map(row => row.code))];
  },

  /** 用户全量权限记录（菜单树授权用） */
  getUserPermissions(userId: string): PermissionRecord[] {
    const userRoles = appDb.select({ roleId: userRole.roleId }).from(userRole).where(eq(userRole.userId, userId)).all();
    if (!userRoles.length) return [];

    const roleIds = userRoles.map(row => row.roleId);
    const rows = appDb
      .select({ permission })
      .from(rolePermission)
      .innerJoin(permission, eq(rolePermission.permissionId, permission.id))
      .where(and(inArray(rolePermission.roleId, roleIds), or(eq(permission.enabled, 'Y'), eq(permission.enabled, 'D'))))
      .all();

    const map = new Map<string, PermissionRecord>();
    rows.forEach(row => map.set(row.permission.id, row.permission));

    return [...map.values()];
  }
};
