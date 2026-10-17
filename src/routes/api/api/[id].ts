import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { requireParam } from '@/shared/route';
import { validate } from '@/shared/validate';
import { apiService } from '@/services/api-org.service';
import { nullDataSchema } from '@/schema/_shared';
import { apiResourceSchema, apiUpdateSchema } from '@/schema/api';
import { currentActor } from '@/shared/actor';

/**
 * `GET /api/api/:id` —— 接口详情。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['接口'],
    summary: '接口详情',
    description: '按主键查询单个接口（名称、路径、HTTP 方法）。',
    responses: {
      200: {
        description: '查询成功',
        content: { 'application/json': { schema: resolver(apiResourceSchema) } }
      }
    }
  }),
  c => c.json(apiService.getApiById(requireParam(c, 'id')))
);

/**
 * `PUT /api/api/:id` —— 更新接口。
 */
export const PUT = defineHandler(
  describeRoute({
    tags: ['接口'],
    summary: '更新接口',
    description: '按主键更新接口（字段全部可选，未传字段保留原值）。',
    responses: {
      200: {
        description: '更新成功',
        content: { 'application/json': { schema: resolver(apiResourceSchema) } }
      }
    }
  }),
  validate('json', apiUpdateSchema),
  c => {
    const id = requireParam(c, 'id');
    const body = c.req.valid('json');

    return c.json(apiService.updateApi(id, body, currentActor(c)));
  }
);

/**
 * `DELETE /api/api/:id` —— 删除接（软删 enabled='D'）。
 */
export const DELETE = defineHandler(
  describeRoute({
    tags: ['接口'],
    summary: '删除接口',
    description: '按主键软删接口（enabled 置为 D）；无业务数据，data 恒为 null。',
    responses: {
      200: {
        description: '删除成功',
        content: { 'application/json': { schema: resolver(nullDataSchema) } }
      }
    }
  }),
  async c => {
    await apiService.deleteApi(requireParam(c, 'id'));

    return c.json(null);
  }
);
