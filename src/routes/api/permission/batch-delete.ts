import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { validate } from '@/shared/validate';
import { permissionService } from '@/services/permission.service';
import { batchDeleteSchema, nullDataSchema } from '@/schema/_shared';

/**
 * `POST /api/permission/batch-delete` —— 批量删除权限。
 */
export const POST = defineHandler(
  describeRoute({
    tags: ['权限'],
    summary: '批量删除权限点',
    description: '按主键列表批量软删权限点（enabled 置为 D）；data 恒为 null。',
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

    permissionService.batchDeletePermissions(ids);

    return c.json(null);
  }
);
