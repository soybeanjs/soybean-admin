import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { requireParam } from '@/shared/route';
import { validate } from '@/shared/validate';
import { userService } from '@/services/user.service';
import { nullDataSchema } from '@/schema/_shared';
import { userRoleAssignSchema } from '@/schema/user';

/**
 * `PUT /api/user/:id/roles` —— 为用户分配角色（全量替换）。
 */
export const PUT = defineHandler(
  describeRoute({
    tags: ['用户'],
    summary: '用户分配角色',
    description: '全量替换该用户绑定的角色列表（先清空再写入）；data 恒为 null。',
    responses: {
      200: {
        description: '分配成功',
        content: { 'application/json': { schema: resolver(nullDataSchema) } }
      }
    }
  }),
  validate('json', userRoleAssignSchema),
  c => {
    const id = requireParam(c, 'id');
    const { roleIds } = c.req.valid('json');

    userService.replaceUserRoles(id, roleIds);

    return c.json(null);
  }
);
