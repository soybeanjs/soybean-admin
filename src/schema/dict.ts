import { description, intersect, nonEmpty, object, optional, partial, picklist, pipe, string } from 'valibot';
import type { InferOutput } from 'valibot';
import type { DictRow } from '@/service/api/org-dict';
import { nullableText, requiredText } from './_form';
import { searchText, yesOrNoSearchSchema } from './_search';
import { descriptionSchema, paginationQuerySchema, yesOrNoSchema } from './_shared';

/**
 * 字典契约（v3 §6.3，unify dict.service 范式）。
 *
 * `update` 一律由 `create` + `partial` 推导，值域只声明一份。
 */

/* -------------------------------------------------------------------------- */
/*                              服务端请求 schema                              */
/* -------------------------------------------------------------------------- */

/** 新增字典 */
export const dictCreateSchema = object({
  name: pipe(string(), nonEmpty('字典名称不能为空'), description('字典名称')),
  code: pipe(string(), nonEmpty('字典编码不能为空'), description('字典编码，全局唯一')),
  description: descriptionSchema,
  isSystem: optional(yesOrNoSchema, 'N')
});

/** 更新字典（字段同新增，全部可选） */
export const dictUpdateSchema = partial(dictCreateSchema);

/** 字典分页查询 */
export const dictQuerySchema = intersect([
  paginationQuerySchema,
  object({
    name: optional(pipe(string(), description('字典名称，模糊匹配'))),
    code: optional(pipe(string(), description('字典编码，模糊匹配'))),
    isSystem: optional(yesOrNoSchema)
  })
]);

/* -------------------------------------------------------------------------- */
/*                                搜索表单 schema                              */
/* -------------------------------------------------------------------------- */

/** 字典列表搜索表单 */
export const dictSearchFormSchema = object({
  name: searchText('字典名称'),
  code: searchText('字典编码'),
  isSystem: yesOrNoSearchSchema
});

/* -------------------------------------------------------------------------- */
/*                               operate 表单 schema                           */
/* -------------------------------------------------------------------------- */

/** 字典新增 / 编辑表单 */
export const dictFormSchema = object({
  name: requiredText('字典名称'),
  code: requiredText('字典编码'),
  isSystem: pipe(picklist(['Y', 'N']), description('是否系统内置字典')),
  description: nullableText('备注说明')
});

/* -------------------------------------------------------------------------- */
/*                              表单默认值与映射                               */
/* -------------------------------------------------------------------------- */

/** 新增字典的空表默认值 */
export const emptyDictForm: DictFormDTO = {
  name: '',
  code: '',
  isSystem: 'N',
  description: null
};

/** 字典行 → 编辑表单值 */
export function toDictForm(row: DictRow): DictFormDTO {
  return {
    name: row.name,
    code: row.code,
    isSystem: row.isSystem,
    description: row.description
  };
}

/* -------------------------------------------------------------------------- */
/*                                  类型导出                                   */
/* -------------------------------------------------------------------------- */

export type DictCreateDTO = InferOutput<typeof dictCreateSchema>;
export type DictUpdateDTO = InferOutput<typeof dictUpdateSchema>;
export type DictQuery = InferOutput<typeof dictQuerySchema>;
export type DictSearchFormDTO = InferOutput<typeof dictSearchFormSchema>;
export type DictFormDTO = InferOutput<typeof dictFormSchema>;
