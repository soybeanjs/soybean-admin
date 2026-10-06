import { defineHandler, describeRoute } from 'ubean/server';
import { validate } from '@/shared/validate';
import { dictService } from '@/services/dict.service';
import { dictItemCreateSchema } from '@/schema/org-dict';

/**
 * `POST /api/dict-item` —— 新增字典。
 */
export const POST = defineHandler(
  describeRoute({
    tags: ['字典项'],
    summary: '新增字典',
    responses: { 200: { description: '创建后的记录' } }
  }),
  validate('json', dictItemCreateSchema),
  c => {
    const body = c.req.valid('json');

    return c.json(dictService.createDictItem(body));
  }
);
