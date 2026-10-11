import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { requireParam } from '@/shared/route';
import { validate } from '@/shared/validate';
import { orgService } from '@/services/api-org.service';
import { nullDataSchema } from '@/schema/_shared';
import { orgResourceSchema, orgUpdateSchema } from '@/schema/org';

/**
 * `GET /api/org/:id` —— 组织详情。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['组织'],
    summary: '组织详情',
    description: '按主键查询单个组织。',
    responses: {
      200: {
        description: '查询成功',
        content: { 'application/json': { schema: resolver(orgResourceSchema) } }
      }
    }
  }),
  c => c.json(orgService.getOrgById(requireParam(c, 'id')))
);

/**
 * `PUT /api/org/:id` —— 更新组织。
 */
export const PUT = defineHandler(
  describeRoute({
    tags: ['组织'],
    summary: '更新组织',
    description: '按主键更新组织（字段全部可选，未传字段保留原值）。',
    responses: {
      200: {
        description: '更新成功',
        content: { 'application/json': { schema: resolver(orgResourceSchema) } }
      }
    }
  }),
  validate('json', orgUpdateSchema),
  c => {
    const id = requireParam(c, 'id');
    const body = c.req.valid('json');

    return c.json(orgService.updateOrg(id, body));
  }
);

/**
 * `DELETE /api/org/:id` —— 删除组（软删 enabled='D'）。
 */
export const DELETE = defineHandler(
  describeRoute({
    tags: ['组织'],
    summary: '删除组织',
    description: '按主键软删组织（enabled 置为 D）；data 恒为 null。',
    responses: {
      200: {
        description: '删除成功',
        content: { 'application/json': { schema: resolver(nullDataSchema) } }
      }
    }
  }),
  c => {
    orgService.deleteOrg(requireParam(c, 'id'));

    return c.json(null);
  }
);
