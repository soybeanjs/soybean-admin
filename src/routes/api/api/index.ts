import { defineHandler, describeRoute, resolver } from 'ubean/server';
import { validate } from '@/shared/validate';
import { apiService } from '@/services/api-org.service';
import { apiCreateSchema, apiResourceSchema } from '@/schema/api';

/**
 * `POST /api/api` —— 新增接口。
 */
export const POST = defineHandler(
  describeRoute({
    tags: ['接口'],
    summary: '新增接口',
    description: '新增接口；路径与 HTTP 方法共同决定 RBAC 权限码 api:{method}:{path}。',
    responses: {
      200: {
        description: '创建成功',
        content: { 'application/json': { schema: resolver(apiResourceSchema) } }
      }
    }
  }),
  validate('json', apiCreateSchema),
  c => {
    const body = c.req.valid('json');

    return c.json(apiService.createApi(body));
  }
);
