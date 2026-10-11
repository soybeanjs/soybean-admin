import { defineHandler, describeRoute } from 'ubean/server';
import { validate } from '@/shared/validate';
import { apiService } from '@/services/api-org.service';
import { apiCreateSchema } from '@/schema/api';

/**
 * `POST /api/api` —— 新增接。
 */
export const POST = defineHandler(
  describeRoute({
    tags: ['接口'],
    summary: '新增接',
    responses: { 200: { description: '创建后的记录' } }
  }),
  validate('json', apiCreateSchema),
  c => {
    const body = c.req.valid('json');

    return c.json(apiService.createApi(body));
  }
);
