import { defineHandler, describeRoute } from 'ubean/server';
import { validate } from '@/shared/validate';
import { permissionService } from '@/services/permission.service';
import { permissionCreateSchema } from '@/schema/permission';

/**
 * `POST /api/permission` —— 新增权。
 */
export const POST = defineHandler(
  describeRoute({
    tags: ['权限'],
    summary: '新增权',
    responses: { 200: { description: '创建后的记录' } }
  }),
  validate('json', permissionCreateSchema),
  c => {
    const body = c.req.valid('json');

    return c.json(permissionService.createPermission(body));
  }
);
