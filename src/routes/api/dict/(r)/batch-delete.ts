import { defineHandler, describeRoute } from 'ubean/server';
import { validate } from '@/shared/validate';
import { dictService } from '@/services/dict.service';
import { batchDeleteSchema } from '@/schema/shared';

/**
 * `POST /api/dict/batch-delete` —— 批量删除字典。
 */
export const POST = defineHandler(
  describeRoute({
    tags: ['字典'],
    summary: '批量删除字典',
    responses: { 200: { description: '删除成功' } }
  }),
  validate('json', batchDeleteSchema),
  c => {
    const { ids } = c.req.valid('json');

    dictService.batchDeleteDicts(ids);

    return c.json(null);
  }
);
