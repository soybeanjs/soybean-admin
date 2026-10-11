import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { validate } from '@/shared/validate';
import { dictService } from '@/services/dict.service';
import { dictItemPageSchema, dictItemQuerySchema } from '@/schema/dict-item';

/**
 * `GET /api/dict-item/list` —— 字典项分页列表。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['字典项'],
    summary: '字典项分页列表',
    description: '按所属字典、名称、值筛选，返回分页字典项。',
    responses: {
      200: {
        description: '查询成功',
        content: { 'application/json': { schema: resolver(dictItemPageSchema) } }
      }
    }
  }),
  validate('query', dictItemQuerySchema),
  c => {
    const query = c.req.valid('query');

    return c.json(dictService.getDictItemList(query));
  }
);
