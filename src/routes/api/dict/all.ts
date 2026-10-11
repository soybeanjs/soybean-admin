import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { dictService } from '@/services/dict.service';
import { dictListSchema } from '@/schema/dict';

/**
 * `GET /api/dict/all` —— 字典全量列表（下拉/选择器用）。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['字典'],
    summary: '字典全量列表',
    description: '返回全部字典（未分页），供字典项归属选择。',
    responses: {
      200: {
        description: '查询成功',
        content: { 'application/json': { schema: resolver(dictListSchema) } }
      }
    }
  }),
  c => c.json(dictService.getAllDicts())
);
