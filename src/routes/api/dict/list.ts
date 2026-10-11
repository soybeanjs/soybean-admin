import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { validate } from '@/shared/validate';
import { dictService } from '@/services/dict.service';
import { dictPageSchema, dictQuerySchema } from '@/schema/dict';

/**
 * `GET /api/dict/list` —— 字典分页列表。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['字典'],
    summary: '字典分页列表',
    description: '按名称、编码、是否系统内置筛选，返回分页字典记录。',
    responses: {
      200: {
        description: '查询成功',
        content: { 'application/json': { schema: resolver(dictPageSchema) } }
      }
    }
  }),
  validate('query', dictQuerySchema),
  c => {
    const query = c.req.valid('query');

    return c.json(dictService.getDictList(query));
  }
);
