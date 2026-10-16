import { description, nonEmpty, nullable, pipe, string } from 'valibot';

/** operate 表单的**跨域公共片段**（P3-03） 详见 docs/v3-notes.md N-194。 */

/** 行可选字段 → 表单字符串 */
export function text(value: string | null | undefined): string {
  return value ?? '';
}

/** 必填文本字段 */
export const requiredText = (label: string) => pipe(string(), nonEmpty(`${label}不能为空`), description(label));

/** 「可为空文本」字段 详见 docs/v3-notes.md N-195。 */
export const nullableText = (label: string) => nullable(pipe(string(), description(label)));
