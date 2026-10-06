import { defineHandler, describeRoute } from 'ubean/server';
import { requireParam } from '@/shared/route';
import { validate } from '@/shared/validate';
import { orgService } from '@/services/api-org.service';
import { orgUserAssignSchema } from '@/schema/org-dict';

/**
 * `PUT /api/org/:id/users` —— 组织绑定用户（全量替换）。
 */
export const PUT = defineHandler(
  describeRoute({
    tags: ['Org'],
    summary: '组织绑定用户',
    responses: { 200: { description: '绑定成功' } }
  }),
  validate('json', orgUserAssignSchema),
  c => {
    const id = requireParam(c, 'id');
    const { userIds } = c.req.valid('json');

    orgService.assignOrgUsers(id, userIds);

    return c.json(null);
  }
);
