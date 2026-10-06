import { defineHandler, describeRoute } from 'ubean/server';
import { requireParam } from '@/shared/route';
import { validate } from '@/shared/validate';
import { apiService } from '@/services/api-org.service';
import { apiUpdateSchema } from '@/schema/api';

/**
 * `GET /api/api/:id` —— 接详情。
 */
export const GET = defineHandler(
  describeRoute({
    tags: ['接口'],
    summary: '接详情',
    responses: { 200: { description: '记录详情' } }
  }),
  c => c.json(apiService.getApiById(requireParam(c, 'id')))
);

/**
 * `PUT /api/api/:id` —— 更新接。
 */
export const PUT = defineHandler(
  describeRoute({
    tags: ['接口'],
    summary: '更新接',
    responses: { 200: { description: '更新后的记录' } }
  }),
  validate('json', apiUpdateSchema),
  c => {
    const id = requireParam(c, 'id');
    const body = c.req.valid('json');

    return c.json(apiService.updateApi(id, body));
  }
);

/**
 * `DELETE /api/api/:id` —— 删除接（软删 enabled='D'）。
 */
export const DELETE = defineHandler(
  describeRoute({
    tags: ['接口'],
    summary: '删除接',
    responses: { 200: { description: '删除成功' } }
  }),
  c => {
    apiService.deleteApi(requireParam(c, 'id'));

    return c.json(null);
  }
);
