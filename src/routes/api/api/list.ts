import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { validate } from '@/shared/validate';
import { apiService } from '@/services/api-org.service';
import { apiPageSchema, apiQuerySchema } from '@/schema/api';

/**
 * `GET /api/api/list` —— 接口分页列表。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['接口'],
    summary: '接口分页列表',
    description: '按名称、路径、HTTP 方法筛选，返回分页接口记录。',
    responses: {
      200: {
        description: '查询成功',
        content: { 'application/json': { schema: resolver(apiPageSchema) } }
      }
    }
  }),
  validate('query', apiQuerySchema),
  c => {
    const query = c.req.valid('query');

    return c.json(apiService.getApiList(query));
  }
);
