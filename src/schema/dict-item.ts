import {
  array,
  description,
  integer,
  intersect,
  nonEmpty,
  nullable,
  number,
  object,
  optional,
  partial,
  pipe,
  string
} from 'valibot';
import type { InferOutput } from 'valibot';
import { requiredText } from './_form';
import { searchText } from './_search';
import {
  auditFields,
  enabledSchema,
  idSchema,
  orderSchema,
  pagedSchema,
  paginationQuerySchema,
  rowText
} from './_shared';

/** 字典项契约（v3 §6.3，unify dict-item 范式）。`update` 一律由 `create` + `partial` 推导，值域只声明一份。 */

/* -------------------------------------------------------------------------- */
/*                              服务端请求 schema                              */
/* -------------------------------------------------------------------------- */

/** 新增字典项 */
export const dictItemCreateSchema = object({
  dictId: pipe(idSchema, description('所属字典 ID')),
  parentId: optional(nullable(pipe(idSchema, description('父字典项 ID，顶层为 null'))), null),
  label: pipe(string(), nonEmpty('字典项名称不能为空'), description('字典项名称')),
  value: pipe(string(), nonEmpty('字典项值不能为空'), description('字典项值')),
  order: orderSchema
});

/** 更新字典项（字段同新增，全部可选） */
export const dictItemUpdateSchema = partial(dictItemCreateSchema);

/** 字典项分页查询 */
export const dictItemQuerySchema = intersect([
  paginationQuerySchema,
  object({
    dictId: optional(pipe(idSchema, description('所属字典 ID'))),
    label: optional(pipe(string(), description('字典项名称，模糊匹配'))),
    value: optional(pipe(string(), description('字典项值，模糊匹配')))
  })
]);

/** 字典树查询（`GET /api/dict-item/tree/:id`） */
export const dictItemTreeParamSchema = object({ id: pipe(idSchema, description('字典 ID')) });

/* -------------------------------------------------------------------------- */
/*                                响应 schema                                 */
/* -------------------------------------------------------------------------- */

/** 字典项资源（新增 / 更新 / 详情响应） */
export const dictItemResourceSchema = object({
  id: idSchema,
  enabled: enabledSchema,
  dictId: pipe(idSchema, description('所属字典 ID')),
  parentId: rowText('父字典项 ID，顶层为 null'),
  label: pipe(string(), description('字典项名称')),
  value: pipe(string(), description('字典项值')),
  order: pipe(number(), integer(), description('排序值，数字越小越靠前')),
  ...auditFields
});

/** `GET /api/dict-item/list` 响应 data */
export const dictItemPageSchema = pagedSchema(dictItemResourceSchema);

/** 字典项列表（无分页的列表端点响应 data） */
export const dictItemListSchema = pipe(array(dictItemResourceSchema), description('字典项列表'));

/* -------------------------------------------------------------------------- */
/*                                搜索表单 schema                              */
/* -------------------------------------------------------------------------- */

/** 字典项列表搜索表单 */
export const dictItemSearchFormSchema = object({
  dictId: searchText('所属字典 ID'),
  label: searchText('字典项名称'),
  value: searchText('字典项值')
});

/* -------------------------------------------------------------------------- */
/*                               operate 表单 schema                           */
/* -------------------------------------------------------------------------- */

/** 字典项新增 / 编辑表单 */
export const dictItemFormSchema = object({
  dictId: requiredText('所属字典 ID'),
  parentId: nullable(idSchema),
  label: requiredText('字典项名称'),
  value: requiredText('字典项值'),
  order: pipe(number(), description('排序值，数字越小越靠前'))
});

/* -------------------------------------------------------------------------- */
/*                              表单默认值与映射                               */
/* -------------------------------------------------------------------------- */

/** 新增字典项的空表默认值 */
export const emptyDictItemForm: DictItemFormDTO = {
  dictId: '',
  parentId: null,
  label: '',
  value: '',
  order: 0
};

/** 字典项行 → 编辑表单值 */
export function toDictItemForm(row: DictItemResource): DictItemFormDTO {
  return {
    dictId: row.dictId,
    parentId: row.parentId,
    label: row.label,
    value: row.value,
    order: row.order
  };
}

/* -------------------------------------------------------------------------- */
/*                                  类型导出                                   */
/* -------------------------------------------------------------------------- */

export type DictItemResource = InferOutput<typeof dictItemResourceSchema>;
export type DictItemList = InferOutput<typeof dictItemListSchema>;
export type DictItemCreateDTO = InferOutput<typeof dictItemCreateSchema>;
export type DictItemUpdateDTO = InferOutput<typeof dictItemUpdateSchema>;
export type DictItemQuery = InferOutput<typeof dictItemQuerySchema>;
export type DictItemTreeParam = InferOutput<typeof dictItemTreeParamSchema>;
export type DictItemSearchFormDTO = InferOutput<typeof dictItemSearchFormSchema>;
export type DictItemFormDTO = InferOutput<typeof dictItemFormSchema>;
