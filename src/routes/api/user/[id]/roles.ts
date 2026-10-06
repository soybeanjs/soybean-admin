import { defineHandler, describeRoute } from 'ubean/server';
import { requireParam } from '@/shared/route';
import { validate } from '@/shared/validate';
import { userService } from '@/services/user.service';
import { userRoleAssignSchema } from '@/schema/user';

/**
 * `PUT /api/user/:id/roles` —— 为用户分配角色（全量替换）。
 */
export const PUT = defineHandler(
  describeRoute({
    tags: ['User'],
    summary: '用户分配角色',
    responses: { 200: { description: '分配成功' } }
  }),
  validate('json', userRoleAssignSchema),
  c => {
    const id = requireParam(c, 'id');
    const { roleIds } = c.req.valid('json');

    userService.replaceUserRoles(id, roleIds);

    return c.json(null);
  }
);
