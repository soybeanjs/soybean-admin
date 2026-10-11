import {
  array,
  description,
  integer,
  maxValue,
  minLength,
  minValue,
  nonEmpty,
  nullable,
  number,
  object,
  optional,
  picklist,
  pipe,
  string,
  transform,
  union
} from 'valibot';
import type { InferOutput } from 'valibot';
import { API_METHODS, MENU_TYPES } from '@/db/schema/shared';

/**
 * 服务端 Valibot DTO 的公共片段（v3 §6.1）。
 *
 * 服务端校验用 Valibot（与前端校验、hono-openapi resolver 同栈）；
 * 13 表的 `enabled` 用 `'Y' | 'N' | 'D'` 软删约定（v3 §6.1 数据模型约定，P1-08）。
 *
 * 约定：值域常量与可复用 schema 都带 OpenAPI `description`，供
 * `@valibot/to-json-schema` 生成 `.ubean/openapi.d.ts` 的字段说明。
 */

/** 复用 drizzle 侧值域（单一来源：`src/db/schema/shared.ts`） */
export { API_METHODS, MENU_TYPES } from '@/db/schema/shared';

/** `enabled` 列值域：`'Y'` 启用 / `'N'` 停用 / `'D'` 软删 */
export const ENABLED_VALUES = ['Y', 'N', 'D'] as const;

/** 是/否值域（菜单的 `requiresAuth` / `keepAlive` / `multiTab` / `pinned`，字典的 `isSystem`） */
export const YES_OR_NO_VALUES = ['Y', 'N'] as const;

/** 权限资源类型值域（与 `src/constants/manage.ts` 的 `MANAGE_RESOURCE_TYPES` 一致） */
export const RESOURCE_TYPE_VALUES = ['menu', 'api', 'button', 'other'] as const;

/** 主键 ID（UUID v7 非空字符串） */
export const idSchema = pipe(string(), nonEmpty('ID 不能为空'), description('主键 ID'));

/** `enabled` 字段 */
export const enabledSchema = pipe(picklist(ENABLED_VALUES), description('状态：Y 启用 / N 停用 / D 已删除'));

/** 菜单类型字段 */
export const menuTypeSchema = pipe(picklist(MENU_TYPES), description('菜单类型'));

/** 接口 HTTP 方法字段 */
export const apiMethodSchema = pipe(picklist(API_METHODS), description('HTTP 方法'));

/** 权限资源类型字段 */
export const resourceTypeSchema = pipe(picklist(RESOURCE_TYPE_VALUES), description('绑定的资源类型'));

/** 是/否字段（选填，`'Y'` 为是） */
export const yesOrNoSchema = pipe(picklist(YES_OR_NO_VALUES), description('是否开启：Y 是 / N 否'));

/** 记录排序值：前端可传 string 数字，统一转 number 存库 */
export const orderSchema = optional(
  nullable(pipe(union([number(), pipe(string(), transform(Number))]), description('排序值，数字越小越靠前'))),
  null
);

/** 备注说明字段（选填，可置 null 清空） */
export const descriptionSchema = optional(nullable(pipe(string(), description('备注说明'))), null);

/** 分页查询参数（转数字并夹紧范围；query 校验用） */
export const paginationQuerySchema = object({
  current: optional(
    pipe(
      string(),
      transform(Number),
      number('页码格式错误'),
      integer('页码必须为整数'),
      minValue(1, '页码最小为 1'),
      description('当前页码，从 1 开始')
    ),
    '1'
  ),
  size: optional(
    pipe(
      string(),
      transform(Number),
      number('每页条数格式错误'),
      integer('每页条数必须为整数'),
      minValue(1, '每页条数最小为 1'),
      maxValue(100, '每页条数最多为 100'),
      description('每页条数，1-100')
    ),
    '10'
  ),
  sort: optional(pipe(string(), description('排序字段，前缀 - 表示降序')))
});

/** ID 路径参数（`/:id`） */
export const idParamSchema = object({ id: idSchema });

/** 批量删除入参 */
export const batchDeleteSchema = object({
  ids: pipe(array(idSchema), minLength(1, '至少选择一条记录'), description('待删除的主键 ID 列表'))
});

export type PaginationQuery = InferOutput<typeof paginationQuerySchema>;
