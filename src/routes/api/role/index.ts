import { defineHandler, describeRoute } from 'ubean/server';
import { validate } from '@/shared/validate';
import { roleService } from '@/services/role.service';
import { roleCreateSchema } from '@/schema/role';

/**
 * `POST /api/role` —— 新增角。
 */
export const POST = defineHandler(
  describeRoute({
    tags: ['角色'],
    summary: '新增角',
    responses: { 200: { description: '创建后的记录' } }
  }),
  validate('json', roleCreateSchema),
  c => {
    const body = c.req.valid('json');

    return c.json(roleService.createRole(body));
  }
);
