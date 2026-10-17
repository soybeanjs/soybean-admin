import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { requireParam } from '@/shared/route';
import { validate } from '@/shared/validate';
import { menuService } from '@/services/menu.service';
import { nullDataSchema } from '@/schema/_shared';
import { menuResourceSchema, menuUpdateSchema } from '@/schema/menu';
import { currentActor } from '@/shared/actor';

/**
 * `GET /api/menu/:id` —— 菜单详情。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['菜单'],
    summary: '菜单详情',
    description: '按主键查询单个菜单（含路由定义字段）。',
    responses: {
      200: {
        description: '查询成功',
        content: { 'application/json': { schema: resolver(menuResourceSchema) } }
      }
    }
  }),
  c => c.json(menuService.getMenuById(requireParam(c, 'id')))
);

/**
 * `PUT /api/menu/:id` —— 更新菜单。
 */
export const PUT = defineHandler(
  describeRoute({
    tags: ['菜单'],
    summary: '更新菜单',
    description: '按主键更新菜单（字段全部可选，未传字段保留原值）；校验父级合法性、菜单类型约束与路由唯一性。',
    responses: {
      200: {
        description: '更新成功',
        content: { 'application/json': { schema: resolver(menuResourceSchema) } }
      }
    }
  }),
  validate('json', menuUpdateSchema),
  c => {
    const id = requireParam(c, 'id');
    const body = c.req.valid('json');

    return c.json(menuService.updateMenu(id, body, currentActor(c)));
  }
);

/**
 * `DELETE /api/menu/:id` —— 删除菜（软删 enabled='D'）。
 */
export const DELETE = defineHandler(
  describeRoute({
    tags: ['菜单'],
    summary: '删除菜单',
    description: '按主键软删菜单（enabled 置为 D）；data 恒为 null。',
    responses: {
      200: {
        description: '删除成功',
        content: { 'application/json': { schema: resolver(nullDataSchema) } }
      }
    }
  }),
  async c => {
    await menuService.deleteMenu(requireParam(c, 'id'));

    return c.json(null);
  }
);
