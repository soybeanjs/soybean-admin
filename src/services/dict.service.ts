import { and, asc, count, eq, inArray, like, sql } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
import { AppError } from '@/shared/error';
import { resolveSortColumn } from '@/shared/pagination';
import { createUuidV7 } from '@/shared/uuid';
import type {
  DictCreateDTO,
  DictItemCreateDTO,
  DictItemQuery,
  DictItemUpdateDTO,
  DictQuery,
  DictUpdateDTO
} from '@/schema/org-dict';
import { appDb } from '../db';
import { dict, dictItem } from '../db/schema';

/**
 * 字典服务（P1-07，unify dict.service 范式）。
 */

export type DictRow = typeof dict.$inferSelect;
export type DictItemRow = typeof dictItem.$inferSelect;

const ACTOR = 'admin';

export const dictService = {
  getDictList(query: DictQuery) {
    const conditions: SQL[] = [];

    if (query.name) conditions.push(like(dict.name, `%${query.name}%`));
    if (query.code) conditions.push(like(dict.code, `%${query.code}%`));
    if (query.isSystem) conditions.push(eq(dict.isSystem, query.isSystem));

    const where = conditions.length ? and(...conditions) : undefined;
    const offset = (query.current - 1) * query.size;
    const sort = query.sort ?? '-createdTime';
    const { column: sortColumn, isDesc } = resolveSortColumn(sort, dict, 'createdTime');

    const { total } = appDb.select({ total: count() }).from(dict).where(where).get() ?? { total: 0 };
    const list = appDb
      .select()
      .from(dict)
      .where(where)
      .orderBy(isDesc ? sql`${sortColumn} DESC` : sql`${sortColumn} ASC`)
      .limit(query.size)
      .offset(offset)
      .all();

    return { total, current: query.current, size: query.size, list };
  },

  getAllDicts(): DictRow[] {
    return appDb.select().from(dict).orderBy(asc(dict.code)).all();
  },

  getDictById(id: string): DictRow {
    const [row] = appDb.select().from(dict).where(eq(dict.id, id)).all();

    if (!row) {
      throw new AppError('RESOURCE_NOT_FOUND', '字典不存在');
    }

    return row;
  },

  createDict(dto: DictCreateDTO): DictRow {
    const [existing] = appDb.select().from(dict).where(eq(dict.code, dto.code)).all();
    if (existing) {
      throw new AppError('RESOURCE_EXISTS', '字典编码已存在');
    }

    const now = new Date().toISOString();
    const row: DictRow = {
      id: createUuidV7(),
      name: dto.name,
      code: dto.code,
      description: dto.description ?? null,
      isSystem: dto.isSystem ?? 'N',
      enabled: 'Y',
      createdBy: ACTOR,
      createdTime: now,
      updatedBy: ACTOR,
      updatedTime: now
    };
    appDb.insert(dict).values(row).run();

    return row;
  },

  updateDict(id: string, dto: DictUpdateDTO): DictRow {
    const current = this.getDictById(id);
    const nextCode = dto.code ?? current.code;

    if (nextCode !== current.code) {
      const [existing] = appDb.select().from(dict).where(eq(dict.code, nextCode)).all();
      if (existing && existing.id !== id) {
        throw new AppError('RESOURCE_EXISTS', '字典编码已存在');
      }
    }

    appDb
      .update(dict)
      .set({
        name: dto.name ?? current.name,
        code: nextCode,
        description: dto.description !== undefined ? dto.description : current.description,
        isSystem: dto.isSystem ?? current.isSystem,
        updatedBy: ACTOR,
        updatedTime: new Date().toISOString()
      })
      .where(eq(dict.id, id))
      .run();

    return this.getDictById(id);
  },

  deleteDict(id: string): void {
    const current = this.getDictById(id);

    if (current.isSystem === 'Y') {
      throw new AppError('OPERATION_NOT_ALLOWED', '系统内置字典不可删除');
    }

    appDb.delete(dictItem).where(eq(dictItem.dictId, id)).run();
    appDb.delete(dict).where(eq(dict.id, id)).run();
  },

  batchDeleteDicts(ids: string[]): void {
    if (!ids.length) return;

    const rows = appDb.select().from(dict).where(inArray(dict.id, ids)).all();
    if (rows.some(row => row.isSystem === 'Y')) {
      throw new AppError('OPERATION_NOT_ALLOWED', '系统内置字典不可删除');
    }

    appDb.delete(dictItem).where(inArray(dictItem.dictId, ids)).run();
    appDb.delete(dict).where(inArray(dict.id, ids)).run();
  },

  // ---------- 字典项 ----------

  getDictItemList(query: DictItemQuery) {
    const conditions: SQL[] = [];

    if (query.dictId) conditions.push(eq(dictItem.dictId, query.dictId));
    if (query.label) conditions.push(like(dictItem.label, `%${query.label}%`));
    if (query.value) conditions.push(like(dictItem.value, `%${query.value}%`));

    const where = conditions.length ? and(...conditions) : undefined;
    const offset = (query.current - 1) * query.size;
    const sort = query.sort ?? 'order';
    const { column: sortColumn, isDesc } = resolveSortColumn(sort, dictItem, 'order');

    const { total } = appDb.select({ total: count() }).from(dictItem).where(where).get() ?? { total: 0 };
    const list = appDb
      .select()
      .from(dictItem)
      .where(where)
      .orderBy(isDesc ? sql`${sortColumn} DESC` : sql`${sortColumn} ASC`)
      .limit(query.size)
      .offset(offset)
      .all();

    return { total, current: query.current, size: query.size, list };
  },

  getAllDictItems(dictId?: string): DictItemRow[] {
    const where = dictId ? eq(dictItem.dictId, dictId) : undefined;

    return appDb.select().from(dictItem).where(where).orderBy(asc(dictItem.order)).all();
  },

  getDictItemById(id: string): DictItemRow {
    const [row] = appDb.select().from(dictItem).where(eq(dictItem.id, id)).all();

    if (!row) {
      throw new AppError('RESOURCE_NOT_FOUND', '字典项不存在');
    }

    return row;
  },

  createDictItem(dto: DictItemCreateDTO): DictItemRow {
    this.assertDictExists(dto.dictId);

    const now = new Date().toISOString();
    const row: DictItemRow = {
      id: createUuidV7(),
      dictId: dto.dictId,
      parentId: dto.parentId ?? null,
      label: dto.label,
      value: dto.value,
      order: dto.order ?? 0,
      enabled: 'Y',
      createdBy: ACTOR,
      createdTime: now,
      updatedBy: ACTOR,
      updatedTime: now
    };
    appDb.insert(dictItem).values(row).run();

    return row;
  },

  updateDictItem(id: string, dto: DictItemUpdateDTO): DictItemRow {
    const current = this.getDictItemById(id);

    if (dto.dictId && dto.dictId !== current.dictId) {
      this.assertDictExists(dto.dictId);
    }

    appDb
      .update(dictItem)
      .set({
        dictId: dto.dictId ?? current.dictId,
        parentId: dto.parentId !== undefined ? dto.parentId : current.parentId,
        label: dto.label ?? current.label,
        value: dto.value ?? current.value,
        order: (dto.order !== undefined ? dto.order : current.order) ?? 0,
        updatedBy: ACTOR,
        updatedTime: new Date().toISOString()
      })
      .where(eq(dictItem.id, id))
      .run();

    return this.getDictItemById(id);
  },

  deleteDictItem(id: string): void {
    this.getDictItemById(id);
    appDb.delete(dictItem).where(eq(dictItem.id, id)).run();
  },

  batchDeleteDictItems(ids: string[]): void {
    if (!ids.length) return;
    appDb.delete(dictItem).where(inArray(dictItem.id, ids)).run();
  },

  /** 字典项树（按 dictId 全量 + parentId 建树，与菜单树同构） */
  getDictItemTree(dictId: string): DictItemTree {
    this.assertDictExists(dictId);

    const rows = appDb.select().from(dictItem).where(eq(dictItem.dictId, dictId)).orderBy(asc(dictItem.order)).all();
    const nodeMap = new Map(
      rows.map(row => {
        const node: DictItemTreeNode = { ...row, children: [] };

        return [row.id, node] as const;
      })
    );
    const roots: DictItemTree = [];

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
  },

  assertDictExists(dictId: string): void {
    this.getDictById(dictId);
  }
};

// 字典项树节点类型（递归结构，与菜单树同构）
export type DictItemTreeNode = DictItemRow & { children: DictItemTreeNode[] };
export type DictItemTree = DictItemTreeNode[];
