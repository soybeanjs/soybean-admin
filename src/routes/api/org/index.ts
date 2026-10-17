import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { currentActor } from '@/shared/actor';
import { validate } from '@/shared/validate';
import { orgService } from '@/services/api-org.service';
import { orgCreateSchema, orgResourceSchema } from '@/schema/org';

/**
 * `POST /api/org` —— 新增组织。
 */
export const POST = defineHandler(
  describeRoute({
    tags: ['组织'],
    summary: '新增组织',
    description: '新增组织，可指定父组织组成树；编码全局唯一。',
    responses: {
      200: {
        description: '创建成功',
        content: { 'application/json': { schema: resolver(orgResourceSchema) } }
      }
    }
  }),
  validate('json', orgCreateSchema),
  c => {
    const body = c.req.valid('json');

    return c.json(orgService.createOrg(body, currentActor(c)));
  }
);
