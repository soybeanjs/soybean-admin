import { and, count, eq, inArray, like, sql } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
import { AppError } from '@/shared/error';
import { resolveSortColumn } from '@/shared/pagination';
import { createUuidV7 } from '@/shared/uuid';
import type { RoleCreateDTO, RoleQuery, RoleUpdateDTO } from '@/schema/role';
import { appDb } from '../db';
import { role, rolePermission, userRole } from '../db/schema';
import { permissionService } from './permission.service';

/**
 * 角色服务（P1-07，unify role.service 范式）。
 */

export type RoleRow = typeof role.$inferSelect;

const ACTOR = 'admin';

export const roleService = {
  getRoleList(query: RoleQuery) {
    const conditions: SQL[] = [];

    if (query.name) conditions.push(like(role.name, `%${query.name}%`));
    if (query.code) conditions.push(like(role.code, `%${query.code}%`));
    if (query.enabled) conditions.push(eq(role.enabled, query.enabled));

    const where = conditions.length ? and(...conditions) : undefined;
    const offset = (query.current - 1) * query.size;
    const sort = query.sort ?? '-createdTime';
    const { column: sortColumn, isDesc } = resolveSortColumn(sort, role, 'createdTime');

    const { total } = appDb.select({ total: count() }).from(role).where(where).get() ?? { total: 0 };
    const rows = appDb
      .select()
      .from(role)
      .where(where)
      .orderBy(isDesc ? sql`${sortColumn} DESC` : sql`${sortColumn} ASC`)
      .limit(query.size)
      .offset(offset)
      .all();

    const list = rows.map(row => {
      const { total: userCount } = appDb
        .select({ total: count() })
        .from(userRole)
        .where(eq(userRole.roleId, row.id))
        .get() ?? { total: 0 };

      return { ...row, userCount };
    });

    return { total, current: query.current, size: query.size, list };
  },

  getAllRoles() {
    return appDb.select().from(role).orderBy(role.name).all();
  },

  getRoleById(id: string): RoleRow {
    const [row] = appDb.select().from(role).where(eq(role.id, id)).all();

    if (!row) {
      throw new AppError('RESOURCE_NOT_FOUND', '角色不存在');
    }

    return row;
  },

  getRoleDetailById(id: string): RoleRow & { permissions: Array<{ id: string; name: string; code: string }> } {
    const row = this.getRoleById(id);
    const permissions = permissionService
      .getRolePermissions(id)
      .map(({ id: pid, name, code }) => ({ id: pid, name, code }));

    return { ...row, permissions };
  },

  createRole(dto: RoleCreateDTO): RoleRow {
    const [existing] = appDb.select().from(role).where(eq(role.name, dto.name)).all();
    if (existing) {
      throw new AppError('RESOURCE_EXISTS', '角色名称已存在');
    }

    const now = new Date().toISOString();
    const row: RoleRow = {
      id: createUuidV7(),
      name: dto.name,
      code: dto.code,
      description: dto.description ?? null,
      enabled: 'Y',
      createdBy: ACTOR,
      createdTime: now,
      updatedBy: ACTOR,
      updatedTime: now
    };
    appDb.insert(role).values(row).run();

    if (dto.permissionIds?.length) {
      this.replaceRolePermissions(row.id, dto.permissionIds);
    }

    return row;
  },

  updateRole(id: string, dto: RoleUpdateDTO): RoleRow {
    const current = this.getRoleById(id);

    if (dto.name && dto.name !== current.name) {
      const [existing] = appDb.select().from(role).where(eq(role.name, dto.name)).all();
      if (existing && existing.id !== id) {
        throw new AppError('RESOURCE_EXISTS', '角色名称已存在');
      }
    }

    appDb
      .update(role)
      .set({
        name: dto.name ?? current.name,
        code: dto.code ?? current.code,
        description: dto.description !== undefined ? dto.description : current.description,
        enabled: dto.enabled ?? current.enabled,
        updatedBy: ACTOR,
        updatedTime: new Date().toISOString()
      })
      .where(eq(role.id, id))
      .run();

    if (dto.permissionIds) {
      this.replaceRolePermissions(id, dto.permissionIds);
    }

    return this.getRoleById(id);
  },

  deleteRole(id: string): void {
    this.getRoleById(id);
    appDb.delete(rolePermission).where(eq(rolePermission.roleId, id)).run();
    appDb.delete(userRole).where(eq(userRole.roleId, id)).run();
    appDb.delete(role).where(eq(role.id, id)).run();
  },

  batchDeleteRoles(ids: string[]): void {
    if (!ids.length) return;
    appDb.delete(rolePermission).where(inArray(rolePermission.roleId, ids)).run();
    appDb.delete(userRole).where(inArray(userRole.roleId, ids)).run();
    appDb.delete(role).where(inArray(role.id, ids)).run();
  },

  /** 全量替换角色-权限关联 */
  replaceRolePermissions(roleId: string, permissionIds: string[]): void {
    appDb.delete(rolePermission).where(eq(rolePermission.roleId, roleId)).run();

    if (!permissionIds.length) return;
    const now = new Date().toISOString();
    appDb
      .insert(rolePermission)
      .values(
        permissionIds.map(permissionId => ({
          id: createUuidV7(),
          roleId,
          permissionId,
          createdBy: ACTOR,
          createdTime: now,
          updatedBy: ACTOR,
          updatedTime: now
        }))
      )
      .run();
  },

  getRolesByUserId(userId: string): RoleRow[] {
    return appDb
      .select({ role })
      .from(userRole)
      .innerJoin(role, eq(userRole.roleId, role.id))
      .where(eq(userRole.userId, userId))
      .all()
      .map(row => row.role);
  }
};
