import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { validate } from '@/shared/validate';
import { roleService } from '@/services/role.service';
import { roleCreateSchema, roleResourceSchema } from '@/schema/role';

/**
 * `POST /api/role` —— 新增角色。
 */
export const POST = defineHandler(
  describeRoute({
    tags: ['角色'],
    summary: '新增角色',
    description: '新增角色，编码全局唯一，可同时绑定权限点。',
    responses: {
      200: {
        description: '创建成功',
        content: { 'application/json': { schema: resolver(roleResourceSchema) } }
      }
    }
  }),
  validate('json', roleCreateSchema),
  c => {
    const body = c.req.valid('json');

    return c.json(roleService.createRole(body));
  }
);
