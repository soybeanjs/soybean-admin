import { validator } from 'ubean/server';
import type { Context } from 'hono';
import type { StandardSchemaV1 } from '@standard-schema/spec';
import { createErrorResponse } from './response';

/**
 * 统一参数校验中间件（v3 §6.1，P1-07）。
 *
 * `hono-openapi` 的裸 `validator` 在校验失败时返回标准 400 结构
 * `{ data, error, success: false }`，与 v3 业务码语义不一致。
 * 这里经 hook 把 Standard Schema issues 归一为
 * `{ code: '3000', message, data: issues }`（HTTP 200，业务码 PARAM_INVALID）。
 *
 * OpenAPI 元数据由 `validator` 内部 resolver 透传，`describeRoute` 可照常声明 400 响应。
 */
export function validate<TTarget extends 'json' | 'query', TSchema extends StandardSchemaV1>(
  target: TTarget,
  schema: TSchema
) {
  return validator(target, schema, (result, c: Context) => {
    if (!result.success) {
      const issues = result.error ?? [];
      const first = issues[0];
      const message = first?.message ?? '参数校验失败';

      return c.json(createErrorResponse<StandardSchemaV1.Issue[]>('PARAM_INVALID', message, [...issues]), 200);
    }

    return;
  });
}
