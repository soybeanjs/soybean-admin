import { defineHandler, describeRoute } from 'ubean/server';
import { requireParam } from '@/shared/route';
import { validate } from '@/shared/validate';
import { roleService } from '@/services/role.service';
import { rolePermissionAssignSchema } from '@/schema/permission';

/**
 * `PUT /api/role/:id/permissions` —— 为角色分配权限（全量替换，v3 §6.3）。
 */
export const PUT = defineHandler(
  describeRoute({
    tags: ['Role'],
    summary: '角色分配权限',
    responses: { 200: { description: '分配成功' } }
  }),
  validate('json', rolePermissionAssignSchema),
  c => {
    const id = requireParam(c, 'id');
    const { permissionIds } = c.req.valid('json');

    roleService.replaceRolePermissions(id, permissionIds);

    return c.json(null);
  }
);
