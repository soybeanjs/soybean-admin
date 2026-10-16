import { defineHandler, defineHandlerMeta, describeRoute, resolver } from 'ubean/server';
import { demoErrorCodeMap } from '@/constants/error-code';
import { AppError } from '@/shared/error';
import { validate } from '@/shared/validate';
import { nullDataSchema } from '@/schema/_shared';
import { demoErrorQuerySchema } from '@/schema/auth';

/** 请求演示页按 `?code=` 逐条触发请求层的四类分派： 详见 docs/v3-notes.md N-084。 */
export const POST = defineHandler(
  defineHandlerMeta({ requiresAuth: false }),
  describeRoute({
    tags: ['认证'],
    summary: '错误归一演示',
    description: '按 query.code 抛出演示用业务错误，验证全局错误中间件输出业务码结构与请求层分派。',
    responses: {
      200: {
        description: '始终返回业务错误响应；code=8888/7777/9999 时返回对应演示码',
        content: { 'application/json': { schema: resolver(nullDataSchema) } }
      }
    }
  }),
  validate('query', demoErrorQuerySchema),
  c => {
    const { code } = c.req.valid('query');
    const codeKey = demoErrorCodeMap[code];

    if (!codeKey) {
      throw new AppError('SYSTEM_ERROR', '演示错误：这是错误归一端点的示例输出');
    }

    throw new AppError(codeKey);
  }
);
