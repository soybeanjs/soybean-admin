import { defineHandler, describeRoute } from 'ubean/server';
import { validate } from '@/shared/validate';
import { dictService } from '@/services/dict.service';
import { dictItemQuerySchema } from '@/schema/org-dict';

/**
 * `GET /api/dict-item/list` —— 字典项分页列表。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['字典项'],
    summary: '字典项分页列表',
    responses: { 200: { description: '分页结果' } }
  }),
  validate('query', dictItemQuerySchema),
  c => {
    const query = c.req.valid('query');

    return c.json(dictService.getDictItemList(query));
  }
);
