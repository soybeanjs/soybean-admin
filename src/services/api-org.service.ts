import { and, count, eq, inArray, like, sql } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
import { AppError } from '@/shared/error';
import { resolveSortColumn } from '@/shared/pagination';
import { createUuidV7 } from '@/shared/uuid';
import type { ApiCreateDTO, ApiQuery, ApiUpdateDTO } from '@/schema/api';
import type { OrgCreateDTO, OrgQuery, OrgUpdateDTO } from '@/schema/org-dict';
import { appDb } from '../db';
import { api, org, orgRole, userOrg } from '../db/schema';

/**
 * API 与组织服务（P1-07，unify api.service / org.service 范式）。
 */

export type ApiRow = typeof api.$inferSelect;
export type OrgRow = typeof org.$inferSelect;

const ACTOR = 'admin';

export const apiService = {
  getApiList(query: ApiQuery) {
    const conditions: SQL[] = [];

    if (query.name) conditions.push(like(api.name, `%${query.name}%`));
    if (query.path) conditions.push(like(api.path, `%${query.path}%`));
    if (query.method) conditions.push(eq(api.method, query.method));

    const where = conditions.length ? and(...conditions) : undefined;
    const offset = (query.current - 1) * query.size;
    const sort = query.sort ?? '-createdTime';
    const { column: sortColumn, isDesc } = resolveSortColumn(sort, api, 'createdTime');

    const { total } = appDb.select({ total: count() }).from(api).where(where).get() ?? { total: 0 };
    const list = appDb
      .select()
      .from(api)
      .where(where)
      .orderBy(isDesc ? sql`${sortColumn} DESC` : sql`${sortColumn} ASC`)
      .limit(query.size)
      .offset(offset)
      .all();

    return { total, current: query.current, size: query.size, list };
  },

  getAllApis(): ApiRow[] {
    return appDb.select().from(api).orderBy(api.path, api.method).all();
  },

  getApiById(id: string): ApiRow {
    const [row] = appDb.select().from(api).where(eq(api.id, id)).all();

    if (!row) {
      throw new AppError('RESOURCE_NOT_FOUND', '接口不存在');
    }

    return row;
  },

  createApi(dto: ApiCreateDTO): ApiRow {
    const [existing] = appDb
      .select()
      .from(api)
      .where(and(eq(api.path, dto.path), eq(api.method, dto.method)))
      .all();
    if (existing) {
      throw new AppError('RESOURCE_EXISTS', '接口已存在');
    }

    const now = new Date().toISOString();
    const row: ApiRow = {
      id: createUuidV7(),
      name: dto.name,
      path: dto.path,
      method: dto.method,
      description: dto.description ?? null,
      enabled: 'Y',
      createdBy: ACTOR,
      createdTime: now,
      updatedBy: ACTOR,
      updatedTime: now
    };
    appDb.insert(api).values(row).run();

    return row;
  },

  updateApi(id: string, dto: ApiUpdateDTO): ApiRow {
    const current = this.getApiById(id);
    const nextPath = dto.path ?? current.path;
    const nextMethod = dto.method ?? current.method;

    if (nextPath !== current.path || nextMethod !== current.method) {
      const [existing] = appDb
        .select()
        .from(api)
        .where(and(eq(api.path, nextPath), eq(api.method, nextMethod)))
        .all();
      if (existing && existing.id !== id) {
        throw new AppError('RESOURCE_EXISTS', '接口已存在');
      }
    }

    appDb
      .update(api)
      .set({
        name: dto.name ?? current.name,
        path: nextPath,
        method: nextMethod,
        description: dto.description !== undefined ? dto.description : current.description,
        updatedBy: ACTOR,
        updatedTime: new Date().toISOString()
      })
      .where(eq(api.id, id))
      .run();

    return this.getApiById(id);
  },

  deleteApi(id: string): void {
    this.getApiById(id);
    appDb.delete(api).where(eq(api.id, id)).run();
  },

  batchDeleteApis(ids: string[]): void {
    if (!ids.length) return;
    appDb.delete(api).where(inArray(api.id, ids)).run();
  }
};

export const orgService = {
  getOrgList(query: OrgQuery) {
    const conditions: SQL[] = [];

    if (query.name) conditions.push(like(org.name, `%${query.name}%`));
    if (query.code) conditions.push(like(org.code, `%${query.code}%`));

    const where = conditions.length ? and(...conditions) : undefined;
    const offset = (query.current - 1) * query.size;
    const sort = query.sort ?? '-createdTime';
    const { column: sortColumn, isDesc } = resolveSortColumn(sort, org, 'createdTime');

    const { total } = appDb.select({ total: count() }).from(org).where(where).get() ?? { total: 0 };
    const list = appDb
      .select()
      .from(org)
      .where(where)
      .orderBy(isDesc ? sql`${sortColumn} DESC` : sql`${sortColumn} ASC`)
      .limit(query.size)
      .offset(offset)
      .all();

    return { total, current: query.current, size: query.size, list };
  },

  getAllOrgs(): OrgRow[] {
    return appDb.select().from(org).orderBy(org.createdTime).all();
  },

  getOrgById(id: string): OrgRow {
    const [row] = appDb.select().from(org).where(eq(org.id, id)).all();

    if (!row) {
      throw new AppError('RESOURCE_NOT_FOUND', '组织不存在');
    }

    return row;
  },

  createOrg(dto: OrgCreateDTO): OrgRow {
    if (dto.parentId) this.getOrgById(dto.parentId);

    const [existing] = appDb.select().from(org).where(eq(org.code, dto.code)).all();
    if (existing) {
      throw new AppError('RESOURCE_EXISTS', '组织编码已存在');
    }

    const now = new Date().toISOString();
    const row: OrgRow = {
      id: createUuidV7(),
      parentId: dto.parentId ?? null,
      name: dto.name,
      code: dto.code,
      description: dto.description ?? null,
      enabled: 'Y',
      createdBy: ACTOR,
      createdTime: now,
      updatedBy: ACTOR,
      updatedTime: now
    };
    appDb.insert(org).values(row).run();

    return row;
  },

  updateOrg(id: string, dto: OrgUpdateDTO): OrgRow {
    const current = this.getOrgById(id);

    if (dto.parentId) {
      if (dto.parentId === id) {
        throw new AppError('PARAM_INVALID', '父组织不能是自身');
      }
      this.getOrgById(dto.parentId);
    }

    const nextCode = dto.code ?? current.code;
    if (nextCode !== current.code) {
      const [existing] = appDb.select().from(org).where(eq(org.code, nextCode)).all();
      if (existing && existing.id !== id) {
        throw new AppError('RESOURCE_EXISTS', '组织编码已存在');
      }
    }

    appDb
      .update(org)
      .set({
        parentId: dto.parentId !== undefined ? dto.parentId : current.parentId,
        name: dto.name ?? current.name,
        code: nextCode,
        description: dto.description !== undefined ? dto.description : current.description,
        updatedBy: ACTOR,
        updatedTime: new Date().toISOString()
      })
      .where(eq(org.id, id))
      .run();

    return this.getOrgById(id);
  },

  deleteOrg(id: string): void {
    this.getOrgById(id);
    appDb.delete(orgRole).where(eq(orgRole.orgId, id)).run();
    appDb.delete(userOrg).where(eq(userOrg.orgId, id)).run();
    appDb.delete(org).where(eq(org.id, id)).run();
  },

  batchDeleteOrgs(ids: string[]): void {
    if (!ids.length) return;
    appDb.delete(orgRole).where(inArray(orgRole.orgId, ids)).run();
    appDb.delete(userOrg).where(inArray(userOrg.orgId, ids)).run();
    appDb.delete(org).where(inArray(org.id, ids)).run();
  },

  /** 组织绑定角色 */
  assignOrgRoles(orgId: string, roleIds: string[]): void {
    this.getOrgById(orgId);
    appDb.delete(orgRole).where(eq(orgRole.orgId, orgId)).run();

    if (!roleIds.length) return;
    const now = new Date().toISOString();
    appDb
      .insert(orgRole)
      .values(
        roleIds.map(roleId => ({
          id: createUuidV7(),
          orgId,
          roleId,
          createdBy: ACTOR,
          createdTime: now,
          updatedBy: ACTOR,
          updatedTime: now
        }))
      )
      .run();
  },

  /** 组织分配用户 */
  assignOrgUsers(orgId: string, userIds: string[]): void {
    this.getOrgById(orgId);
    appDb.delete(userOrg).where(eq(userOrg.orgId, orgId)).run();

    if (!userIds.length) return;
    const now = new Date().toISOString();
    appDb
      .insert(userOrg)
      .values(
        userIds.map(userId => ({
          id: createUuidV7(),
          orgId,
          userId,
          createdBy: ACTOR,
          createdTime: now,
          updatedBy: ACTOR,
          updatedTime: now
        }))
      )
      .run();
  }
};
