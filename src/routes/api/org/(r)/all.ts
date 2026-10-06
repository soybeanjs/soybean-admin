import { defineHandler, describeRoute } from 'ubean/server';
import { orgService } from '@/services/api-org.service';

/**
 * `GET /api/org/all` —— 组织全量列表（下拉/选择器用）。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['组织'],
    summary: '组织全量列表',
    responses: { 200: { description: '全量记录' } }
  }),
  c => c.json(orgService.getAllOrgs())
);
