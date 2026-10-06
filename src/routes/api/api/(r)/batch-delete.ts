import { defineHandler, describeRoute } from 'ubean/server';
import { validate } from '@/shared/validate';
import { apiService } from '@/services/api-org.service';
import { batchDeleteSchema } from '@/schema/shared';

/**
 * `POST /api/api/batch-delete` —— 批量删除接口。
 */
export const POST = defineHandler(
  describeRoute({
    tags: ['接口'],
    summary: '批量删除接口',
    responses: { 200: { description: '删除成功' } }
  }),
  validate('json', batchDeleteSchema),
  c => {
    const { ids } = c.req.valid('json');

    apiService.batchDeleteApis(ids);

    return c.json(null);
  }
);
