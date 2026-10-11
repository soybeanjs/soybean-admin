import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { validate } from '@/shared/validate';
import { permissionService } from '@/services/permission.service';
import { permissionCreateSchema, permissionResourceSchema } from '@/schema/permission';

/**
 * `POST /api/permission` —— 新增权限。
 */
export const POST = defineHandler(
  describeRoute({
    tags: ['权限'],
    summary: '新增权限点',
    description: '新增权限点；绑定 menu / api / button 资源时 name 与 code 由服务端推导。',
    responses: {
      200: {
        description: '创建成功',
        content: { 'application/json': { schema: resolver(permissionResourceSchema) } }
      }
    }
  }),
  validate('json', permissionCreateSchema),
  c => {
    const body = c.req.valid('json');

    return c.json(permissionService.createPermission(body));
  }
);
