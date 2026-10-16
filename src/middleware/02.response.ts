import { defineMiddleware } from 'ubean/server';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { createSuccessResponse, isApiResponseStructure } from '@/shared/response';

/** c.json 的窄化签名：只取“响应体 + 可选状态码 + 可选 headers”形态（处理器只用这一种） 详见 docs/v3-notes.md N-076。 */
type JsonFn = (data: unknown, status?: ContentfulStatusCode, headers?: Record<string, string>) => Response;

/** 响应中间件（v3 §6.1，P1-03）：重写 `c.json` 统一包装 `{ code, message, data }` 详见 docs/v3-notes.md N-077。 */
export default defineMiddleware(async (c, next) => {
  // 显式标注 JsonFn：bind 保留的 hono 重载面过窄，调用点三参形态会匹配失败
  const originalJson: JsonFn = c.json.bind(c);

  const wrapped = (data: unknown, status?: ContentfulStatusCode, headers?: Record<string, string>): Response => {
    // 错误响应（validator 400、演示码端点直返完整结构等）不包装，保持业务码语义
    if (status && status >= 400) {
      return originalJson(data, status, headers);
    }

    if (c.req.path.startsWith('/api/') && !isApiResponseStructure(data)) {
      return originalJson(createSuccessResponse(data), status, headers);
    }

    return originalJson(data, status, headers);
  };

  // hono 的 JSONRespond 泛型面无法从窄化签名赋值兼容——类型守卫确认 json 槽位是
  // 函数后，经收窄别名写入（运行时仅替换方法槽位，等价原实现）。
  function isJsonCarrier(value: typeof c): value is typeof c & { json: JsonFn } {
    return typeof value.json === 'function';
  }

  if (isJsonCarrier(c)) {
    const carrier: { json: JsonFn } = c;

    carrier.json = wrapped;
  }

  await next();
});
