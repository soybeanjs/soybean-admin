import { defineHandler, describeRoute } from 'ubean/server';
import { requireParam } from '@/shared/route';
import { validate } from '@/shared/validate';
import { orgService } from '@/services/api-org.service';
import { orgUpdateSchema } from '@/schema/org-dict';

/**
 * `GET /api/org/:id` —— 组详情。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['组织'],
    summary: '组详情',
    responses: { 200: { description: '记录详情' } }
  }),
  c => c.json(orgService.getOrgById(requireParam(c, 'id')))
);

/**
 * `PUT /api/org/:id` —— 更新组。
 */
export const PUT = defineHandler(
  describeRoute({
    tags: ['组织'],
    summary: '更新组',
    responses: { 200: { description: '更新后的记录' } }
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
    summary: '删除组',
    responses: { 200: { description: '删除成功' } }
  }),
  c => {
    orgService.deleteOrg(requireParam(c, 'id'));

    return c.json(null);
  }
);
