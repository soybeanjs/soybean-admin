import { defineHandler, describeRoute } from 'ubean/server';
import { requireParam } from '@/shared/route';
import { validate } from '@/shared/validate';
import { dictService } from '@/services/dict.service';
import { dictUpdateSchema } from '@/schema/org-dict';

/**
 * `GET /api/dict/:id` —— 字详情。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['字典'],
    summary: '字详情',
    responses: { 200: { description: '记录详情' } }
  }),
  c => c.json(dictService.getDictById(requireParam(c, 'id')))
);

/**
 * `PUT /api/dict/:id` —— 更新字。
 */
export const PUT = defineHandler(
  describeRoute({
    tags: ['字典'],
    summary: '更新字',
    responses: { 200: { description: '更新后的记录' } }
  }),
  validate('json', dictUpdateSchema),
  c => {
    const id = requireParam(c, 'id');
    const body = c.req.valid('json');

    return c.json(dictService.updateDict(id, body));
  }
);

/**
 * `DELETE /api/dict/:id` —— 删除字（软删 enabled='D'）。
 */
export const DELETE = defineHandler(
  describeRoute({
    tags: ['字典'],
    summary: '删除字',
    responses: { 200: { description: '删除成功' } }
  }),
  c => {
    dictService.deleteDict(requireParam(c, 'id'));

    return c.json(null);
  }
);
