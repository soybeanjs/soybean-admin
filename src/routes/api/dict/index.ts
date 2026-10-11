import { defineHandler, describeRoute } from 'ubean/server';
import { validate } from '@/shared/validate';
import { dictService } from '@/services/dict.service';
import { dictCreateSchema } from '@/schema/org-dict';

/**
 * `POST /api/dict` —— 新增字。
 */
export const POST = defineHandler(
  describeRoute({
    tags: ['字典'],
    summary: '新增字',
    responses: { 200: { description: '创建后的记录' } }
  }),
  validate('json', dictCreateSchema),
  c => {
    const body = c.req.valid('json');

    return c.json(dictService.createDict(body));
  }
);
