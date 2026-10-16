import { validator } from 'ubean/server';
import type { Context } from 'hono';
import type { StandardSchemaV1 } from '@standard-schema/spec';
import { createErrorResponse } from './response';

/** 统一参数校验中间件（v3 §6.1，P1-07） 详见 docs/v3-notes.md N-183。 */
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
