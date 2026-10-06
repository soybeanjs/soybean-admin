import { ErrorCode } from '@/constants/error-code';
import type { ErrorCodeKey, ErrorCodeValue } from '@/constants/error-code';

/**
 * 统一响应契约（v3 §6.1）：所有 `/api/**` 响应恒为 `{ code, message, data }`。
 * 由 src/middleware/00.response.ts 重写 `c.json` 自动包装，handler 只写业务数据。
 */
export type ApiResponse<T = unknown> = {
  code: ErrorCodeValue;
  message: string;
  data: T | null;
};

/** 成功响应体（code 恒为 '0000'） */
export function createSuccessResponse<T>(data: T, message: string = '成功'): ApiResponse<T> {
  return {
    code: ErrorCode.SUCCESS,
    message,
    data
  };
}

/** 错误响应体（无 data 时返回 null） */
export function createErrorResponse<T = null>(
  codeKey: ErrorCodeKey,
  message: string,
  data?: NoInfer<T>
): ApiResponse<T> {
  return {
    code: ErrorCode[codeKey],
    message,
    data: data === undefined ? null : data
  };
}

/** 判断数据是否已是 `{ code, message, data }` 结构（避免二次包装） */
export function isApiResponseStructure(data: unknown): data is ApiResponse {
  if (Object.prototype.toString.call(data) !== '[object Object]') {
    return false;
  }

  return typeof data === 'object' && data !== null && 'code' in data && 'message' in data && 'data' in data;
}
