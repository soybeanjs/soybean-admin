import { defineHandler, describeRoute } from 'ubean/server';
import { validate } from '@/shared/validate';
import { roleService } from '@/services/role.service';
import { batchDeleteSchema } from '@/schema/shared';

/**
 * `POST /api/role/batch-delete` —— 批量删除角色。
 */
export const POST = defineHandler(
  describeRoute({
    tags: ['角色'],
    summary: '批量删除角色',
    responses: { 200: { description: '删除成功' } }
  }),
  validate('json', batchDeleteSchema),
  c => {
    const { ids } = c.req.valid('json');

    roleService.batchDeleteRoles(ids);

    return c.json(null);
  }
);
