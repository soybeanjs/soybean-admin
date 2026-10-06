import { defineHandler, describeRoute } from 'ubean/server';
import { validate } from '@/shared/validate';
import { dictService } from '@/services/dict.service';
import { dictQuerySchema } from '@/schema/org-dict';

/**
 * `GET /api/dict/list` —— 字典分页列表。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['字典'],
    summary: '字典分页列表',
    responses: { 200: { description: '分页结果' } }
  }),
  validate('query', dictQuerySchema),
  c => {
    const query = c.req.valid('query');

    return c.json(dictService.getDictList(query));
  }
);
