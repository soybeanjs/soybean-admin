import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { validate } from '@/shared/validate';
import { dictService } from '@/services/dict.service';
import { batchDeleteSchema, nullDataSchema } from '@/schema/_shared';

/**
 * `POST /api/dict-item/batch-delete` —— 批量删除字典项。
 */
export const POST = defineHandler(
  describeRoute({
    tags: ['字典项'],
    summary: '批量删除字典项',
    description: '按主键列表批量软删字典项（enabled 置为 D）；data 恒为 null。',
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

    dictService.batchDeleteDictItems(ids);

    return c.json(null);
  }
);
