import * as v from 'valibot';

/**
 * `src/schema/` 是前后端**唯一契约源**：Valibot schema 即运行时校验器，
 * 推导类型即 DTO。前后端同进程，直接相对路径 import，不做构建、不独立发包。
 */

/** 服务健康状态 */
export const healthStatusSchema = v.picklist(['ok', 'degraded', 'down']);

/** `GET /api/system/health` 响应体 */
export const healthInfoSchema = v.object({
  status: healthStatusSchema,
  version: v.string(),
  timestamp: v.number()
});

export type HealthStatus = v.InferOutput<typeof healthStatusSchema>;
export type HealthInfo = v.InferOutput<typeof healthInfoSchema>;
