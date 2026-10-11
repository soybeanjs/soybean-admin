import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { validate } from '@/shared/validate';
import { menuService } from '@/services/menu.service';
import { menuPageSchema, menuQuerySchema } from '@/schema/menu';

/**
 * `GET /api/menu/list` —— 菜单分页列表。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['菜单'],
    summary: '菜单分页列表',
    description: '按菜单类型、名称、编码、父级、登录态、状态筛选，返回分页菜单。',
    responses: {
      200: {
        description: '查询成功',
        content: { 'application/json': { schema: resolver(menuPageSchema) } }
      }
    }
  }),
  validate('query', menuQuerySchema),
  c => {
    const query = c.req.valid('query');

    return c.json(menuService.getMenuList(query));
  }
);
