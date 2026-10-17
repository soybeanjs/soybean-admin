import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { validate } from '@/shared/validate';
import { dictService } from '@/services/dict.service';
import { dictItemCreateSchema, dictItemResourceSchema } from '@/schema/dict-item';
import { currentActor } from '@/shared/actor';

/**
 * `POST /api/dict-item` —— 新增字典项。
 */
export const POST = defineHandler(
  describeRoute({
    tags: ['字典项'],
    summary: '新增字典项',
    description: '新增字典项，可指定父字典项组成树。',
    responses: {
      200: {
        description: '创建成功',
        content: { 'application/json': { schema: resolver(dictItemResourceSchema) } }
      }
    }
  }),
  validate('json', dictItemCreateSchema),
  c => {
    const body = c.req.valid('json');

    return c.json(dictService.createDictItem(body, currentActor(c)));
  }
);
