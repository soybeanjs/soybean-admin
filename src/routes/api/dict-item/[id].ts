import { defineHandler, describeRoute } from 'ubean/server';
import { requireParam } from '@/shared/route';
import { validate } from '@/shared/validate';
import { dictService } from '@/services/dict.service';
import { dictItemUpdateSchema } from '@/schema/org-dict';

/**
 * `GET /api/dict-item/:id` —— 字典详情。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['字典项'],
    summary: '字典详情',
    responses: { 200: { description: '记录详情' } }
  }),
  c => c.json(dictService.getDictItemById(requireParam(c, 'id')))
);

/**
 * `PUT /api/dict-item/:id` —— 更新字典。
 */
export const PUT = defineHandler(
  describeRoute({
    tags: ['字典项'],
    summary: '更新字典',
    responses: { 200: { description: '更新后的记录' } }
  }),
  validate('json', dictItemUpdateSchema),
  c => {
    const id = requireParam(c, 'id');
    const body = c.req.valid('json');

    return c.json(dictService.updateDictItem(id, body));
  }
);

/**
 * `DELETE /api/dict-item/:id` —— 删除字典（软删 enabled='D'）。
 */
export const DELETE = defineHandler(
  describeRoute({
    tags: ['字典项'],
    summary: '删除字典',
    responses: { 200: { description: '删除成功' } }
  }),
  c => {
    dictService.deleteDictItem(requireParam(c, 'id'));

    return c.json(null);
  }
);
