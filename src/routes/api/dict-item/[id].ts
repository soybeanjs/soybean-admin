import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { requireParam } from '@/shared/route';
import { validate } from '@/shared/validate';
import { dictService } from '@/services/dict.service';
import { nullDataSchema } from '@/schema/_shared';
import { dictItemResourceSchema, dictItemUpdateSchema } from '@/schema/dict-item';

/**
 * `GET /api/dict-item/:id` —— 字典详情。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['字典项'],
    summary: '字典项详情',
    description: '按主键查询单个字典项。',
    responses: {
      200: {
        description: '查询成功',
        content: { 'application/json': { schema: resolver(dictItemResourceSchema) } }
      }
    }
  }),
  c => c.json(dictService.getDictItemById(requireParam(c, 'id')))
);

/**
 * `PUT /api/dict-item/:id` —— 更新字典项。
 */
export const PUT = defineHandler(
  describeRoute({
    tags: ['字典项'],
    summary: '更新字典项',
    description: '按主键更新字典项（字段全部可选，未传字段保留原值）。',
    responses: {
      200: {
        description: '更新成功',
        content: { 'application/json': { schema: resolver(dictItemResourceSchema) } }
      }
    }
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
    summary: '删除字典项',
    description: '按主键软删字典项（enabled 置为 D）；data 恒为 null。',
    responses: {
      200: {
        description: '删除成功',
        content: { 'application/json': { schema: resolver(nullDataSchema) } }
      }
    }
  }),
  c => {
    dictService.deleteDictItem(requireParam(c, 'id'));

    return c.json(null);
  }
);
