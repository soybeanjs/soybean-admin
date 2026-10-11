import { defineHandler, describeRoute } from 'ubean/server';
import { validate } from '@/shared/validate';
import { orgService } from '@/services/api-org.service';
import { orgQuerySchema } from '@/schema/org-dict';

/**
 * `GET /api/org/list` —— 组织分页列表。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['组织'],
    summary: '组织分页列表',
    responses: { 200: { description: '分页结果' } }
  }),
  validate('query', orgQuerySchema),
  c => {
    const query = c.req.valid('query');

    return c.json(orgService.getOrgList(query));
  }
);
