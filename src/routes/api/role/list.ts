import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { validate } from '@/shared/validate';
import { roleService } from '@/services/role.service';
import { rolePageSchema, roleQuerySchema } from '@/schema/role';

/**
 * `GET /api/role/list` —— 角色分页列表。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['角色'],
    summary: '角色分页列表',
    description: '按名称、编码、状态筛选，返回分页角色（含已分配用户数）。',
    responses: {
      200: {
        description: '查询成功',
        content: { 'application/json': { schema: resolver(rolePageSchema) } }
      }
    }
  }),
  validate('query', roleQuerySchema),
  c => {
    const query = c.req.valid('query');

    return c.json(roleService.getRoleList(query));
  }
);
