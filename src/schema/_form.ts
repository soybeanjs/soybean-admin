import { description, nonEmpty, nullable, pipe, string } from 'valibot';

/**
 * operate 表单的**跨域公共片段**（P3-03）。
 *
 * 为什么不直接用 `*.createSchema`：`useForm`（`@vean/ui`）通过
 * `@tanstack/form-core` 的 `DeepKeys<Values>` 推导字段名，而
 * `v.optional(v.string())`（不含默认值，如 `userUpdateSchema.password`）会把
 * 字段推成 `string | undefined`，TanStack 的 `DeepKeys<unknown>` 退化为
 * `never[]` —— `SFormField` 的 `name` 与插槽类型随即整体失效。所以表单只接
 * **每个键都有值**的 schema；各域自己的表单 schema 放在各自域文件里，复用
 * `create` schema 的同一个字段对象（值域不会两份漂移）。
 *
 * 本文件同时放「行数据 → 表单值」的公共换算：`null` → 空串，`SInput` /
 * `SSelect` 的 `modelValue` 是 `string`，收 `null` 会退化成非受控；表单一律用
 * 空串表达「未填」，提交时再还原成 `null`。
 */

/** 行可选字段 → 表单字符串 */
export function text(value: string | null | undefined): string {
  return value ?? '';
}

/** 必填文本字段 */
export const requiredText = (label: string) => pipe(string(), nonEmpty(`${label}不能为空`), description(label));

/**
 * 「可为空文本」字段。
 *
 * **不用 `_shared.ts` 的 `descriptionSchema`**：它是
 * `v.optional(v.nullable(v.string()), null)`，输入类型含 `undefined`，而
 * `useForm` 的 `onSubmit` 回调收到的是 `InferStandardSchemaInput`（输入类型）——
 * 拿它去构造 DTO（输出类型）会报 `string | null | undefined` 不可赋值给
 * `string | null`。表单里该字段总有一个确定值（空串或字符串），故这里用
 * `v.nullable(v.string())`：值域与 DTO 一致，且不引入 `undefined`。
 */
export const nullableText = (label: string) => nullable(pipe(string(), description(label)));
