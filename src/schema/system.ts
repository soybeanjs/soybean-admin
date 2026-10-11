import { description, number, object, picklist, pipe, string } from 'valibot';
import type { InferOutput } from 'valibot';

/**
 * 系统域 DTO（v3 §6.3）。
 *
 * `src/schema/` 是前后端**唯一契约源**：Valibot schema 即运行时校验器，
 * 推导类型即 DTO。前后端同进程，直接相对路径 import，不做构建、不独立发包。
 */

/** 服务健康状态 */
export const healthStatusSchema = picklist(['ok', 'degraded', 'down'], '服务状态');

/** `GET /api/system/health` 响应体 */
export const healthInfoSchema = object({
  status: healthStatusSchema,
  version: pipe(string(), description('应用版本')),
  timestamp: pipe(number(), description('服务器时间戳（毫秒）'))
});

export type HealthStatus = InferOutput<typeof healthStatusSchema>;
export type HealthInfo = InferOutput<typeof healthInfoSchema>;
