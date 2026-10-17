import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { validate } from '@/shared/validate';
import { apiService } from '@/services/api-org.service';
import { batchDeleteSchema, nullDataSchema } from '@/schema/_shared';

/**
 * `POST /api/api/batch-delete` —— 批量删除接口。
 */
export const POST = defineHandler(
  describeRoute({
    tags: ['接口'],
    summary: '批量删除接口',
    description: '按主键列表批量软删接口（enabled 置为 D）；data 恒为 null。',
    responses: {
      200: {
        description: '删除成功',
        content: { 'application/json': { schema: resolver(nullDataSchema) } }
      }
    }
  }),
  validate('json', batchDeleteSchema),
  async c => {
    const { ids } = c.req.valid('json');

    await apiService.batchDeleteApis(ids);

    return c.json(null);
  }
);
