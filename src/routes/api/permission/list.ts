import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { validate } from '@/shared/validate';
import { permissionService } from '@/services/permission.service';
import { permissionPageSchema, permissionQuerySchema } from '@/schema/permission';

/**
 * `GET /api/permission/list` —— 权限分页列表。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['权限'],
    summary: '权限点分页列表',
    description: '按名称、编码、资源类型、状态筛选，返回分页权限点。',
    responses: {
      200: {
        description: '查询成功',
        content: { 'application/json': { schema: resolver(permissionPageSchema) } }
      }
    }
  }),
  validate('query', permissionQuerySchema),
  c => {
    const query = c.req.valid('query');

    return c.json(permissionService.getPermissionList(query));
  }
);
