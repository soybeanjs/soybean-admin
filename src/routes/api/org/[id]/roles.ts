import { defineHandler, describeRoute } from 'ubean/server';
import { requireParam } from '@/shared/route';
import { validate } from '@/shared/validate';
import { orgService } from '@/services/api-org.service';
import { orgRoleAssignSchema } from '@/schema/org-dict';

/**
 * `PUT /api/org/:id/roles` —— 组织绑定角色（全量替换）。
 */
export const PUT = defineHandler(
  describeRoute({
    tags: ['Org'],
    summary: '组织绑定角色',
    responses: { 200: { description: '绑定成功' } }
  }),
  validate('json', orgRoleAssignSchema),
  c => {
    const id = requireParam(c, 'id');
    const { roleIds } = c.req.valid('json');

    orgService.assignOrgRoles(id, roleIds);

    return c.json(null);
  }
);
