import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { validate } from '@/shared/validate';
import { dictService } from '@/services/dict.service';
import { dictCreateSchema, dictResourceSchema } from '@/schema/dict';
import { currentActor } from '@/shared/actor';

/**
 * `POST /api/dict` —— 新增字典。
 */
export const POST = defineHandler(
  describeRoute({
    tags: ['字典'],
    summary: '新增字典',
    description: '新增字典；编码全局唯一。',
    responses: {
      200: {
        description: '创建成功',
        content: { 'application/json': { schema: resolver(dictResourceSchema) } }
      }
    }
  }),
  validate('json', dictCreateSchema),
  c => {
    const body = c.req.valid('json');

    return c.json(dictService.createDict(body, currentActor(c)));
  }
);
