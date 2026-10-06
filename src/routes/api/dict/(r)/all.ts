import { defineHandler, describeRoute } from 'ubean/server';
import { dictService } from '@/services/dict.service';

/**
 * `GET /api/dict/all` —— 字典全量列表（下拉/选择器用）。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['字典'],
    summary: '字典全量列表',
    responses: { 200: { description: '全量记录' } }
  }),
  c => c.json(dictService.getAllDicts())
);
