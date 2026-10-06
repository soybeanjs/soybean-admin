import { defineHandler, describeRoute } from 'ubean/server';
import { validate } from '@/shared/validate';
import { roleService } from '@/services/role.service';
import { roleQuerySchema } from '@/schema/role';

/**
 * `GET /api/role/list` —— 角色分页列表。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['角色'],
    summary: '角色分页列表',
    responses: { 200: { description: '分页结果' } }
  }),
  validate('query', roleQuerySchema),
  c => {
    const query = c.req.valid('query');

    return c.json(roleService.getRoleList(query));
  }
);
