import * as v from 'valibot';
import { API_METHODS, MENU_TYPES } from '@/db/schema/shared';

/**
 * 服务端 Valibot DTO（v3 §6.1）。
 *
 * 服务端校验用 Valibot（与前端校验、hono-openapi resolver 同栈）；
 * 13 表的 enabled 用 'Y'|'N'|'D' 软删约定（v3 §6.1 数据模型约定，P1-08）。
 */

export { API_METHODS, MENU_TYPES } from '@/db/schema/shared';

/** enabled 列合法值 */
export const ENABLED_VALUES = ['Y', 'N', 'D'] as const;
export type EnabledValue = (typeof ENABLED_VALUES)[number];

export const enabledSchema = v.picklist(ENABLED_VALUES);
export const menuTypeSchema = v.picklist(MENU_TYPES);
export const apiMethodSchema = v.picklist(API_METHODS);
export const idSchema = v.pipe(v.string(), v.nonEmpty());
/** 记录排序值（前端传 string 数字，存库统一转 number） */
export const orderSchema = v.optional(v.nullable(v.union([v.number(), v.pipe(v.string(), v.transform(Number))])), null);
export const descriptionSchema = v.optional(v.nullable(v.string()), null);

/** 分页查询（query 校验用，转数字并夹紧范围） */
export const paginationQuerySchema = v.object({
  current: v.optional(v.pipe(v.string(), v.transform(Number), v.number(), v.integer(), v.minValue(1)), '1'),
  size: v.optional(
    v.pipe(v.string(), v.transform(Number), v.number(), v.integer(), v.minValue(1), v.maxValue(100)),
    '10'
  ),
  sort: v.optional(v.string())
});
export type PaginationQuery = v.InferOutput<typeof paginationQuerySchema>;

/** 列表通用状态过滤 */
export const statusQuerySchema = v.object({ enabled: v.optional(enabledSchema) });

/** id 路径参数 */
export const idParamSchema = v.object({ id: idSchema });

/** 批量删除 */
export const batchDeleteSchema = v.object({ ids: v.pipe(v.array(idSchema), v.minLength(1)) });
