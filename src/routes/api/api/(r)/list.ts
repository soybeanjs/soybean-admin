import { defineHandler, describeRoute } from 'ubean/server';
import { validate } from '@/shared/validate';
import { apiService } from '@/services/api-org.service';
import { apiQuerySchema } from '@/schema/api';

/**
 * `GET /api/api/list` —— 接口分页列表。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['接口'],
    summary: '接口分页列表',
    responses: { 200: { description: '分页结果' } }
  }),
  validate('query', apiQuerySchema),
  c => {
    const query = c.req.valid('query');

    return c.json(apiService.getApiList(query));
  }
);
