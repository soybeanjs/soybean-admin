import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { validate } from '@/shared/validate';
import { orgService } from '@/services/api-org.service';
import { batchDeleteSchema, nullDataSchema } from '@/schema/_shared';

/**
 * `POST /api/org/batch-delete` —— 批量删除组织。
 */
export const POST = defineHandler(
  describeRoute({
    tags: ['组织'],
    summary: '批量删除组织',
    description: '按主键列表批量软删组织（enabled 置为 D）；data 恒为 null。',
    responses: {
      200: {
        description: '删除成功',
        content: { 'application/json': { schema: resolver(nullDataSchema) } }
      }
    }
  }),
  validate('json', batchDeleteSchema),
  c => {
    const { ids } = c.req.valid('json');

    orgService.batchDeleteOrgs(ids);

    return c.json(null);
  }
);
