import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { currentActor } from '@/shared/actor';
import { requireParam } from '@/shared/route';
import { validate } from '@/shared/validate';
import { orgService } from '@/services/api-org.service';
import { nullDataSchema } from '@/schema/_shared';
import { orgUserAssignSchema } from '@/schema/org';

/**
 * `PUT /api/org/:id/users` —— 组织绑定用户（全量替换）。
 */
export const PUT = defineHandler(
  describeRoute({
    tags: ['组织'],
    summary: '组织绑定用户',
    description: '全量替换该组织绑定的用户列表（先清空再写入）；data 恒为 null。',
    responses: {
      200: {
        description: '绑定成功',
        content: { 'application/json': { schema: resolver(nullDataSchema) } }
      }
    }
  }),
  validate('json', orgUserAssignSchema),
  c => {
    const id = requireParam(c, 'id');
    const { userIds } = c.req.valid('json');

    orgService.assignOrgUsers(id, userIds, currentActor(c));

    return c.json(null);
  }
);
