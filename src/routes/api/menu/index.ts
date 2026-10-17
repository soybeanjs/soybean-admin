import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { currentActor } from '@/shared/actor';
import { validate } from '@/shared/validate';
import { menuService } from '@/services/menu.service';
import { menuCreateSchema, menuResourceSchema } from '@/schema/menu';

/**
 * `POST /api/menu` —— 新增菜单。
 */
export const POST = defineHandler(
  describeRoute({
    tags: ['菜单'],
    summary: '新增菜单',
    description: '新增菜单（目录 / 菜单 / 页面 / iframe / 外链 / 按钮）；校验父级合法性、菜单类型约束与路由唯一性。',
    responses: {
      200: {
        description: '创建成功',
        content: { 'application/json': { schema: resolver(menuResourceSchema) } }
      }
    }
  }),
  validate('json', menuCreateSchema),
  c => {
    const body = c.req.valid('json');

    return c.json(menuService.createMenu(body, currentActor(c)));
  }
);
