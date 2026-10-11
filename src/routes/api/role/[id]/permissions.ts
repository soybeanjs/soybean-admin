import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { requireParam } from '@/shared/route';
import { validate } from '@/shared/validate';
import { roleService } from '@/services/role.service';
import { nullDataSchema } from '@/schema/_shared';
import { rolePermissionAssignSchema } from '@/schema/permission';

/**
 * `PUT /api/role/:id/permissions` —— 为角色分配权限（全量替换，v3 §6.3）。
 */
export const PUT = defineHandler(
  describeRoute({
    tags: ['角色'],
    summary: '角色分配权限',
    description: '全量替换该角色绑定的权限点列表（先清空再写入）；data 恒为 null。',
    responses: {
      200: {
        description: '分配成功',
        content: { 'application/json': { schema: resolver(nullDataSchema) } }
      }
    }
  }),
  validate('json', rolePermissionAssignSchema),
  c => {
    const id = requireParam(c, 'id');
    const { permissionIds } = c.req.valid('json');

    roleService.replaceRolePermissions(id, permissionIds);

    return c.json(null);
  }
);
