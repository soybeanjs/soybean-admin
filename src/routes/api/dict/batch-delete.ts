import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { validate } from '@/shared/validate';
import { dictService } from '@/services/dict.service';
import { batchDeleteSchema, nullDataSchema } from '@/schema/_shared';

/**
 * `POST /api/dict/batch-delete` —— 批量删除字典。
 */
export const POST = defineHandler(
  describeRoute({
    tags: ['字典'],
    summary: '批量删除字典',
    description: '按主键列表批量软删字典（enabled 置为 D）；data 恒为 null。',
    responses: {
      200: {
        description: '删除成功',
        content: { 'application/json': { schema: resolver(nullDataSchema) } }
      }
    }
  }),
  validate('json', batchDeleteSchema),
  c => {
    const { ids } = c.req.valid('json');

    dictService.batchDeleteDicts(ids);

    return c.json(null);
  }
);
