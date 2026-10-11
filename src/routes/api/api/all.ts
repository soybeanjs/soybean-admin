import { defineHandler, describeRoute } from 'ubean/server';
import { apiService } from '@/services/api-org.service';

/**
 * `GET /api/api/all` —— 接口全量列表（下拉/选择器用）。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['接口'],
    summary: '接口全量列表',
    responses: { 200: { description: '全量记录' } }
  }),
  c => c.json(apiService.getAllApis())
);
