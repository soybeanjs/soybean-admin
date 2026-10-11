import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { orgService } from '@/services/api-org.service';
import { orgListSchema } from '@/schema/org';

/**
 * `GET /api/org/all` —— 组织全量列表（下拉/选择器用）。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['组织'],
    summary: '组织全量列表',
    description: '返回全部组织（未分页），供父级选择。',
    responses: {
      200: {
        description: '查询成功',
        content: { 'application/json': { schema: resolver(orgListSchema) } }
      }
    }
  }),
  c => c.json(orgService.getAllOrgs())
);
