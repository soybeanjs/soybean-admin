import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { apiService } from '@/services/api-org.service';
import { apiListSchema } from '@/schema/api';

/**
 * `GET /api/api/all` —— 接口全量列表（下拉/选择器用）。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['接口'],
    summary: '接口全量列表',
    description: '返回全部接口（未分页），供权限点绑定接口资源时选择。',
    responses: {
      200: {
        description: '查询成功',
        content: { 'application/json': { schema: resolver(apiListSchema) } }
      }
    }
  }),
  c => c.json(apiService.getAllApis())
);
