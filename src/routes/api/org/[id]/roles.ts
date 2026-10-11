import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { requireParam } from '@/shared/route';
import { validate } from '@/shared/validate';
import { orgService } from '@/services/api-org.service';
import { nullDataSchema } from '@/schema/_shared';
import { orgRoleAssignSchema } from '@/schema/org';

/**
 * `PUT /api/org/:id/roles` —— 组织绑定角色（全量替换）。
 */
export const PUT = defineHandler(
  describeRoute({
    tags: ['组织'],
    summary: '组织绑定角色',
    description: '全量替换该组织绑定的角色列表（先清空再写入）；data 恒为 null。',
    responses: {
      200: {
        description: '绑定成功',
        content: { 'application/json': { schema: resolver(nullDataSchema) } }
      }
    }
  }),
  validate('json', orgRoleAssignSchema),
  c => {
    const id = requireParam(c, 'id');
    const { roleIds } = c.req.valid('json');

    orgService.assignOrgRoles(id, roleIds);

    return c.json(null);
  }
);
