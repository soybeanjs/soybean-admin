import { and, count, eq, inArray, like, sql } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
import { comparePassword, hashPassword } from '@/shared/auth';
import { AppError } from '@/shared/error';
import { resolveSortColumn } from '@/shared/pagination';
import { createUuidV7 } from '@/shared/uuid';
import type { UserCreateDTO, UserQuery, UserUpdateDTO } from '@/schema/user';
import { appDb } from '../db';
import { user, userRole } from '../db/schema';
import { permissionService } from './permission.service';
import { roleService } from './role.service';

/**
 * 用户服务（P1-07，unify user.service 范式）。
 * 列表永不返回 password；分配角色 = delete + insert 全量替换。
 *
 * 依赖 `roleService` / `permissionService` 只用于 `getProfile`（P3-09 个人中心），
 * 二者都不 import 本模块，无循环依赖。
 */

export type UserRow = typeof user.$inferSelect;

const ACTOR = 'admin';

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
    if (query.enabled) conditions.push(eq(user.enabled, query.enabled));

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

    const list = rows.map(row => {
      const roleLinks = appDb.select({ id: userRole.roleId }).from(userRole).where(eq(userRole.userId, row.id)).all();

      return { ...stripPassword(row), roles: roleLinks.map(link => ({ id: link.id })) };
    });

    return { total, current: query.current, size: query.size, list };
  },

  findUserById(id: string): UserRow | undefined {
    const [row] = appDb.select().from(user).where(eq(user.id, id)).all();

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

  /**
   * 当前用户的个人资料视图（P3-09）。
   *
   * 比 `getUserById` 多的是展示所需的角色码 / 按钮权限码（个人中心要显示
   * 「我有哪些角色和权限」），少的是 `password`。与 `authService.getUserInfo`
   * 同构，但后者是**登录态**语义（还带 `homePath` 等），这里是**自助编辑**
   * 语义的返回值，放在 user 域避免路由层跨服务拼装。
   */
  async getProfile(id: string): Promise<Omit<UserRow, 'password'> & { roles: string[]; buttons: string[] }> {
    const row = this.getUserById(id);
    const roles = roleService.getRolesByUserId(id).map(role => role.code);
    const buttons = permissionService.getUserPermissionCodes(id);

    return { ...stripPassword(row), roles, buttons };
  },

  replaceUserRoles(userId: string, roleIds: string[]): void {
    appDb.delete(userRole).where(eq(userRole.userId, userId)).run();

    if (!roleIds.length) return;
    const now = new Date().toISOString();
    appDb
      .insert(userRole)
      .values(
        roleIds.map(roleId => ({
          id: createUuidV7(),
          userId,
          roleId,
          createdBy: ACTOR,
          createdTime: now,
          updatedBy: ACTOR,
          updatedTime: now
        }))
      )
      .run();
  },

  async createUser(dto: UserCreateDTO): Promise<Omit<UserRow, 'password'>> {
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
      createdBy: ACTOR,
      createdTime: now,
      updatedBy: ACTOR,
      updatedTime: now
    };
    appDb.insert(user).values(row).run();
    this.replaceUserRoles(row.id, dto.roleIds ?? []);

    return stripPassword(row);
  },

  async updateUser(id: string, dto: UserUpdateDTO): Promise<Omit<UserRow, 'password'>> {
    const current = this.getUserById(id);
    const nextPassword = dto.password ? await hashPassword(dto.password) : current.password;

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
        password: nextPassword,
        updatedBy: ACTOR,
        updatedTime: new Date().toISOString()
      })
      .where(eq(user.id, id))
      .run();

    if (dto.roleIds) {
      this.replaceUserRoles(id, dto.roleIds);
    }

    return stripPassword(this.getUserById(id));
  },

  deleteUser(id: string): void {
    this.getUserById(id);
    appDb.delete(userRole).where(eq(userRole.userId, id)).run();
    appDb.delete(user).where(eq(user.id, id)).run();
  },

  batchDeleteUsers(ids: string[]): void {
    if (!ids.length) return;
    appDb.delete(userRole).where(inArray(userRole.userId, ids)).run();
    appDb.delete(user).where(inArray(user.id, ids)).run();
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
