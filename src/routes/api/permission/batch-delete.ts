import { defineHandler, describeRoute } from 'ubean/server';
import { validate } from '@/shared/validate';
import { permissionService } from '@/services/permission.service';
import { batchDeleteSchema } from '@/schema/shared';

/**
 * `POST /api/permission/batch-delete` —— 批量删除权限。
 */
export const POST = defineHandler(
  describeRoute({
    tags: ['权限'],
    summary: '批量删除权限',
    responses: { 200: { description: '删除成功' } }
  }),
  validate('json', batchDeleteSchema),
  c => {
    const { ids } = c.req.valid('json');

    permissionService.batchDeletePermissions(ids);

    return c.json(null);
  }
);
