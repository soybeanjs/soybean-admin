import { and, count, eq, inArray, like, sql } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
import { AppError } from '@/shared/error';
import { resolveSortColumn } from '@/shared/pagination';
import { getCachedPermissionCodes, invalidateAllPermissionCache } from '@/shared/permission-cache';
import { buildApiPermissionCode } from '@/shared/route';
import { createUuidV7 } from '@/shared/uuid';
import type { PermissionCreateDTO, PermissionQuery, PermissionUpdateDTO } from '@/schema/permission';
import { appDb } from '../db';
import { api, menu, permission, role, rolePermission, userRole } from '../db/schema';

/** 权限服务（P1-07，unify permission.service 范式） 详见 docs/v3-notes.md N-254。 */

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

    return { name: `接口:${apiRow.name}`, code: buildApiPermissionCode(apiRow.method, apiRow.path) };
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

  async updatePermission(id: string, dto: PermissionUpdateDTO): Promise<PermissionRecord> {
    const current = this.getPermissionById(id);
    const nextType = dto.resourceType ?? current.resourceType;
    const nextResourceId = dto.resourceId !== undefined ? dto.resourceId : current.resourceId;
    const binding = resolveResourceBinding(nextType, nextResourceId);
    const nextName = binding?.name ?? dto.name ?? current.name;
    const nextCode = binding?.code ?? dto.code ?? current.code;
    const nextEnabled = dto.enabled ?? current.enabled;

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
        enabled: nextEnabled,
        description: dto.description !== undefined ? dto.description : current.description,
        updatedBy: 'admin',
        updatedTime: new Date().toISOString()
      })
      .where(eq(permission.id, id))
      .run();

    // 改了 code / 启用停用 / 改挂载资源，缓存里的权限码集合都可能失效 → 全清
    if (
      nextCode !== current.code ||
      nextEnabled !== current.enabled ||
      dto.resourceId !== undefined ||
      dto.resourceType !== undefined
    ) {
      await invalidateAllPermissionCache();
    }

    return this.getPermissionById(id);
  },

  async deletePermission(id: string): Promise<void> {
    this.getPermissionById(id);
    appDb.transaction(tx => {
      tx.delete(rolePermission).where(eq(rolePermission.permissionId, id)).run();
      tx.delete(permission).where(eq(permission.id, id)).run();
    });
    await invalidateAllPermissionCache();
  },

  async batchDeletePermissions(ids: string[]): Promise<void> {
    if (!ids.length) return;
    appDb.transaction(tx => {
      tx.delete(rolePermission).where(inArray(rolePermission.permissionId, ids)).run();
      tx.delete(permission).where(inArray(permission.id, ids)).run();
    });
    await invalidateAllPermissionCache();
  },

  getRolePermissions(roleId: string) {
    return appDb
      .select({ permission })
      .from(rolePermission)
      .innerJoin(permission, eq(rolePermission.permissionId, permission.id))
      .where(and(eq(rolePermission.roleId, roleId), eq(permission.enabled, 'Y')))
      .all()
      .map(row => row.permission);
  },

  /** 判定完全基于缓存里的**权限码集合**（一次 KV 读），不再每次三查库： 详见 docs/v3-notes.md N-255。 */
  async checkUserHasPermission(userId: string, code: string): Promise<boolean> {
    const codes = await getCachedPermissionCodes(userId, () => this.queryUserPermissionCodes(userId));

    return codes.includes(code);
  },

  /** 用户全量权限码集合（去重，带缓存） */
  getUserPermissionCodes(userId: string): Promise<string[]> {
    return getCachedPermissionCodes(userId, () => this.queryUserPermissionCodes(userId));
  },

  /** 权限码集合回源（同步三查，缓存未命中时调用） 详见 docs/v3-notes.md N-256。 */
  queryUserPermissionCodes(userId: string): string[] {
    const roleIds = appDb
      .select({ roleId: userRole.roleId })
      .from(userRole)
      .innerJoin(role, eq(userRole.roleId, role.id))
      .where(and(eq(userRole.userId, userId), eq(role.enabled, 'Y')))
      .all()
      .map(row => row.roleId);

    if (!roleIds.length) return [];

    const rows = appDb
      .select({ code: permission.code })
      .from(rolePermission)
      .innerJoin(permission, eq(rolePermission.permissionId, permission.id))
      .where(and(inArray(rolePermission.roleId, roleIds), eq(permission.enabled, 'Y')))
      .all();

    return [...new Set(rows.map(row => row.code))];
  },

  /** 用户全量权限记录（菜单树授权用）；同样只取启用中的角色与权限点 */
  getUserPermissions(userId: string): PermissionRecord[] {
    const roleIds = appDb
      .select({ roleId: userRole.roleId })
      .from(userRole)
      .innerJoin(role, eq(userRole.roleId, role.id))
      .where(and(eq(userRole.userId, userId), eq(role.enabled, 'Y')))
      .all()
      .map(row => row.roleId);

    if (!roleIds.length) return [];

    const rows = appDb
      .select({ permission })
      .from(rolePermission)
      .innerJoin(permission, eq(rolePermission.permissionId, permission.id))
      .where(and(inArray(rolePermission.roleId, roleIds), eq(permission.enabled, 'Y')))
      .all();

    const map = new Map<string, PermissionRecord>();
    rows.forEach(row => map.set(row.permission.id, row.permission));

    return [...map.values()];
  }
};
