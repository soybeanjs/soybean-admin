import { defineHandler, describeRoute } from 'ubean/server';
import { validate } from '@/shared/validate';
import { orgService } from '@/services/api-org.service';
import { orgCreateSchema } from '@/schema/org-dict';

/**
 * `POST /api/org` —— 新增组。
 */
export const POST = defineHandler(
  describeRoute({
    tags: ['组织'],
    summary: '新增组',
    responses: { 200: { description: '创建后的记录' } }
  }),
  validate('json', orgCreateSchema),
  c => {
    const body = c.req.valid('json');

    return c.json(orgService.createOrg(body));
  }
);
