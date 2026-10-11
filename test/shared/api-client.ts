import { readFileSync } from 'node:fs';
import { expect } from 'vitest';

/**
 * 集成测试共用的 HTTP 客户端（`test/integration/**`）。
 *
 * `test/global-setup.ts` 自起（或复用）dev server 后把实际地址写进
 * `test/baseUrl.txt`，这里读它 —— 因此用例不硬编码 9527，也不管是自起还是复用。
 *
 * 所有端点经响应包装中间件输出统一信封 `{ code, message, data }`（v3 §6.1），
 * 所以 `api()` 直接按信封类型收，`okData()` 断言业务码 `0000` 并取出 `data`。
 */

/** dev server 地址（由 `test/global-setup.ts` 写入，末尾无换行已 trim） */
export const BASE_URL = readFileSync(new URL('../baseUrl.txt', import.meta.url), 'utf-8').trim();

/** 统一响应信封（v3 §6.1：接口响应固定 `{ code, message, data }`） */
export type ApiEnvelope<T = unknown> = { code: string; message: string; data: T };

/**
 * 发起一次 API 请求，返回 HTTP 状态码 + 已解析的信封。
 *
 * 注意：**不断言状态码**。后端对业务失败也返回 200 + 非 `0000` 业务码，
 * 只有未认证/路由不存在等才用 HTTP 码，所以断言留给用例自己按需写。
 */
export async function api<T = unknown>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  options: { body?: unknown; token?: string; query?: Record<string, string> } = {}
): Promise<{ status: number; body: ApiEnvelope<T> }> {
  const url = new URL(path, BASE_URL);

  for (const [key, value] of Object.entries(options.query ?? {})) {
    url.searchParams.set(key, value);
  }

  const res = await fetch(url, {
    method,
    headers: {
      ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
    },
    // GET 不允许携带 body（unicorn/no-invalid-fetch-options），条件展开规避 undefined 字段
    ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {})
  });
  // 所有端点经响应包装中间件输出统一信封，这里直接按信封类型收（fetch json 返回 any，赋值即合法）
  const body: ApiEnvelope<T> = await res.json();

  return { status: res.status, body };
}

/** 断言业务成功（code === '0000'）并取出 data */
export function okData<T>(body: ApiEnvelope<T>): T {
  expect(body.code).toBe('0000');

  return body.data;
}
