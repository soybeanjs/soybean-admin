import { defineHandler, describeRoute } from 'ubean/server';
import { validate } from '@/shared/validate';
import { orgService } from '@/services/api-org.service';
import { batchDeleteSchema } from '@/schema/shared';

/**
 * `POST /api/org/batch-delete` —— 批量删除组织。
 */
export const POST = defineHandler(
  describeRoute({
    tags: ['组织'],
    summary: '批量删除组织',
    responses: { 200: { description: '删除成功' } }
  }),
  validate('json', batchDeleteSchema),
  c => {
    const { ids } = c.req.valid('json');

    orgService.batchDeleteOrgs(ids);

    return c.json(null);
  }
);
