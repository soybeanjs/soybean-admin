import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { requireParam } from '@/shared/route';
import { validate } from '@/shared/validate';
import { dictService } from '@/services/dict.service';
import { nullDataSchema } from '@/schema/_shared';
import { dictResourceSchema, dictUpdateSchema } from '@/schema/dict';
import { currentActor } from '@/shared/actor';

/**
 * `GET /api/dict/:id` —— 字典详情。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['字典'],
    summary: '字典详情',
    description: '按主键查询单个字典。',
    responses: {
      200: {
        description: '查询成功',
        content: { 'application/json': { schema: resolver(dictResourceSchema) } }
      }
    }
  }),
  c => c.json(dictService.getDictById(requireParam(c, 'id')))
);

/**
 * `PUT /api/dict/:id` —— 更新字典。
 */
export const PUT = defineHandler(
  describeRoute({
    tags: ['字典'],
    summary: '更新字典',
    description: '按主键更新字典（字段全部可选，未传字段保留原值）。',
    responses: {
      200: {
        description: '更新成功',
        content: { 'application/json': { schema: resolver(dictResourceSchema) } }
      }
    }
  }),
  validate('json', dictUpdateSchema),
  c => {
    const id = requireParam(c, 'id');
    const body = c.req.valid('json');

    return c.json(dictService.updateDict(id, body, currentActor(c)));
  }
);

/**
 * `DELETE /api/dict/:id` —— 删除字（软删 enabled='D'）。
 */
export const DELETE = defineHandler(
  describeRoute({
    tags: ['字典'],
    summary: '删除字典',
    description: '按主键软删字典（enabled 置为 D）；data 恒为 null。',
    responses: {
      200: {
        description: '删除成功',
        content: { 'application/json': { schema: resolver(nullDataSchema) } }
      }
    }
  }),
  c => {
    dictService.deleteDict(requireParam(c, 'id'));

    return c.json(null);
  }
);
