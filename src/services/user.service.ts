import { and, count, eq, inArray, like, ne, sql } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
import { comparePassword, hashPassword } from '@/shared/auth';
import { SYSTEM_ACTOR } from '@/shared/actor';
import { AppError } from '@/shared/error';
import { resolveSortColumn } from '@/shared/pagination';
import { invalidateUserPermissionCacheMany } from '@/shared/permission-cache';
import { createUuidV7 } from '@/shared/uuid';
import type { UserCreateDTO, UserQuery, UserUpdateDTO } from '@/schema/user';
import { appDb } from '../db';
import { user, userRole } from '../db/schema';
import { permissionService } from './permission.service';
import { roleService } from './role.service';

/** 用户服务（P1-07，unify user.service 范式） 详见 docs/v3-notes.md N-258。 */

export type UserRow = typeof user.$inferSelect;

function stripPassword(row: UserRow): Omit<UserRow, 'password'> {
  const { password: _password, ...rest } = row;
  void _password;

  return rest;
}

export const userService = {
  getUserList(query: UserQuery) {
    const conditions: SQL[] = [];

    if (query.username) conditions.push(like(user.username, `%${query.username}%`));
    if (query.phone) conditions.push(like(user.phone, `%${query.phone}%`));
    if (query.email) conditions.push(like(user.email, `%${query.email}%`));
    if (query.fullName) conditions.push(like(user.fullName, `%${query.fullName}%`));
    // 软删行（enabled='D'）默认不出现在列表里，只有显式按 enabled=D 过滤才查得到
    conditions.push(query.enabled ? eq(user.enabled, query.enabled) : ne(user.enabled, 'D'));

    const where = conditions.length ? and(...conditions) : undefined;
    const offset = (query.current - 1) * query.size;
    const sort = query.sort ?? '-createdTime';
    const { column: sortColumn, isDesc } = resolveSortColumn(sort, user, 'createdTime');

    const { total } = appDb.select({ total: count() }).from(user).where(where).get() ?? { total: 0 };
    const rows = appDb
      .select()
      .from(user)
      .where(where)
      .orderBy(isDesc ? sql`${sortColumn} DESC` : sql`${sortColumn} ASC`)
      .limit(query.size)
      .offset(offset)
      .all();

    // 一次批量查角色绑定，再在内存里按 userId 归组 —— 逐行查是 N+1（size=100 时 102 条 SQL）
    const userIds = rows.map(row => row.id);
    const roleLinks = userIds.length
      ? appDb
          .select({ userId: userRole.userId, roleId: userRole.roleId })
          .from(userRole)
          .where(inArray(userRole.userId, userIds))
          .all()
      : [];

    const rolesByUserId = new Map<string, { id: string }[]>();
    roleLinks.forEach(link => {
      const bucket = rolesByUserId.get(link.userId) ?? [];
      bucket.push({ id: link.roleId });
      rolesByUserId.set(link.userId, bucket);
    });

    const list = rows.map(row => ({ ...stripPassword(row), roles: rolesByUserId.get(row.id) ?? [] }));

    return { total, current: query.current, size: query.size, list };
  },

  /** 软删（`enabled='D'`）的用户视同不存在：详情、鉴权、资料都走这里 */
  findUserById(id: string): UserRow | undefined {
    const [row] = appDb
      .select()
      .from(user)
      .where(and(eq(user.id, id), ne(user.enabled, 'D')))
      .all();

    return row;
  },

  findUserByUsername(username: string): UserRow | undefined {
    const [row] = appDb.select().from(user).where(eq(user.username, username)).all();

    return row;
  },

  getUserById(id: string): UserRow {
    const row = this.findUserById(id);

    if (!row) {
      throw new AppError('USER_NOT_FOUND', '用户不存在');
    }

    return row;
  },

  /** 当前用户的个人资料视图（P3-09） 详见 docs/v3-notes.md N-259。 */
  async getProfile(id: string): Promise<Omit<UserRow, 'password'> & { roles: string[]; buttons: string[] }> {
    const row = this.getUserById(id);
    const roles = roleService.getRolesByUserId(id).map(role => role.code);
    const buttons = await permissionService.getUserPermissionCodes(id);

    return { ...stripPassword(row), roles, buttons };
  },

  /** 全量替换用户-角色关联（失效该用户权限码缓存） */
  async replaceUserRoles(userId: string, roleIds: string[], actor: string = SYSTEM_ACTOR): Promise<void> {
    const now = new Date().toISOString();

    appDb.transaction(tx => {
      tx.delete(userRole).where(eq(userRole.userId, userId)).run();

      if (roleIds.length) {
        tx.insert(userRole)
          .values(
            roleIds.map(roleId => ({
              id: createUuidV7(),
              userId,
              roleId,
              createdBy: actor,
              createdTime: now,
              updatedBy: actor,
              updatedTime: now
            }))
          )
          .run();
      }
    });

    await invalidateUserPermissionCacheMany([userId]);
  },

  async createUser(dto: UserCreateDTO, actor: string = SYSTEM_ACTOR): Promise<Omit<UserRow, 'password'>> {
    if (this.findUserByUsername(dto.username)) {
      throw new AppError('RESOURCE_EXISTS', '用户名已存在');
    }

    const now = new Date().toISOString();
    const row: UserRow = {
      id: createUuidV7(),
      username: dto.username,
      password: await hashPassword(dto.password),
      phone: dto.phone ?? null,
      email: dto.email ?? null,
      fullName: dto.fullName ?? dto.username,
      avatar: dto.avatar ?? null,
      description: null,
      homePath: dto.homePath ?? '/home',
      enabled: 'Y',
      createdBy: actor,
      createdTime: now,
      updatedBy: actor,
      updatedTime: now
    };
    appDb.insert(user).values(row).run();
    await this.replaceUserRoles(row.id, dto.roleIds ?? [], actor);

    return stripPassword(row);
  },

  async updateUser(id: string, dto: UserUpdateDTO, actor: string = SYSTEM_ACTOR): Promise<Omit<UserRow, 'password'>> {
    const current = this.getUserById(id);

    appDb
      .update(user)
      .set({
        phone: dto.phone !== undefined ? dto.phone : current.phone,
        email: dto.email !== undefined ? dto.email : current.email,
        fullName: dto.fullName !== undefined ? dto.fullName : current.fullName,
        avatar: dto.avatar !== undefined ? dto.avatar : current.avatar,
        homePath: dto.homePath !== undefined ? dto.homePath : current.homePath,
        description: dto.description !== undefined ? dto.description : current.description,
        enabled: dto.enabled ?? current.enabled,
        // 只在显式传 password 时才写这一列 —— 否则会把当前哈希重算一遍（bcrypt 随机盐
        // 让每次结果都不同，等于无条件改密码 + 多一次 100ms 级开销）
        ...(dto.password ? { password: await hashPassword(dto.password) } : {}),
        updatedBy: actor,
        updatedTime: new Date().toISOString()
      })
      .where(eq(user.id, id))
      .run();

    if (dto.roleIds) {
      await this.replaceUserRoles(id, dto.roleIds, actor);
    } else if (dto.enabled !== undefined) {
      // 停用用户 → 权限码缓存失效（启用同理，保持对称）
      await invalidateUserPermissionCacheMany([id]);
    }

    return stripPassword(this.getUserById(id));
  },

  /**
   * 软删（`enabled` 置 `'D'`），与 OpenAPI 文案一致 —— 硬删会连带丢掉审计线索，
   * 而 `user_role` 里的历史绑定也再无法回溯。`findUserById` 会把 `'D'` 视同不存在。
   */
  async deleteUser(id: string, actor: string = SYSTEM_ACTOR): Promise<void> {
    this.getUserById(id);
    appDb
      .update(user)
      .set({ enabled: 'D', updatedBy: actor, updatedTime: new Date().toISOString() })
      .where(eq(user.id, id))
      .run();
    await invalidateUserPermissionCacheMany([id]);
  },

  async batchDeleteUsers(ids: string[], actor: string = SYSTEM_ACTOR): Promise<void> {
    if (!ids.length) return;

    // 先确认全部存在：部分 id 已删时静默跳过会让调用方以为都删掉了
    const existing = appDb
      .select({ id: user.id })
      .from(user)
      .where(and(inArray(user.id, ids), ne(user.enabled, 'D')))
      .all();

    if (existing.length !== ids.length) {
      throw new AppError('RESOURCE_NOT_FOUND', '部分用户不存在');
    }

    appDb
      .update(user)
      .set({ enabled: 'D', updatedBy: actor, updatedTime: new Date().toISOString() })
      .where(inArray(user.id, ids))
      .run();
    await invalidateUserPermissionCacheMany(ids);
  },

  /** 修改当前用户密码 */
  async modifyPassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const row = this.getUserById(userId);
    const matched = await comparePassword(currentPassword, row.password);

    if (!matched) {
      throw new AppError('PASSWORD_INVALID', '当前密码错误');
    }

    appDb
      .update(user)
      .set({ password: await hashPassword(newPassword), updatedBy: userId, updatedTime: new Date().toISOString() })
      .where(eq(user.id, userId))
      .run();
  }
};
