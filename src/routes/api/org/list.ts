import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { validate } from '@/shared/validate';
import { orgService } from '@/services/api-org.service';
import { orgPageSchema, orgQuerySchema } from '@/schema/org';

/**
 * `GET /api/org/list` —— 组织分页列表。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['组织'],
    summary: '组织分页列表',
    description: '按名称、编码筛选，返回分页组织记录。',
    responses: {
      200: {
        description: '查询成功',
        content: { 'application/json': { schema: resolver(orgPageSchema) } }
      }
    }
  }),
  validate('query', orgQuerySchema),
  c => {
    const query = c.req.valid('query');

    return c.json(orgService.getOrgList(query));
  }
);
