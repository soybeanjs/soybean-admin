import { ErrorCode } from '@/constants/error-code';
import type { ErrorCodeKey, ErrorCodeValue } from '@/constants/error-code';

/** 统一响应契约（v3 §6.1）：所有 `/api/**` 响应恒为 `{ code, message, data }` 详见 docs/v3-notes.md N-166。 */
export type ApiResponse<T = unknown> = {
  code: ErrorCodeValue;
  message: string;
  data: T | null;
};

/**
 * 统一响应体的品牌标记（不可枚举，不参与 `JSON.stringify`）。
 *
 * 响应包装中间件需要判断「这个响应体是不是已经包过了，别再包一层」。原实现靠猜
 * 字段名（`'code' in data && 'message' in data && 'data' in data`）：任何业务数据
 * 恰好带这三个 key 都会被视为已包装而漏包，而不带它们的错误响应又会被再包一层
 * （审计 2.7）。品牌只由本文件的工厂函数打上，判据从启发式变成事实。
 */
const API_RESPONSE_BRAND = Symbol.for('soybean:api-response');

/** 给响应体打品牌，并冻结属性描述符以防被序列化到线上 */
function brand<T>(body: ApiResponse<T>): ApiResponse<T> {
  Object.defineProperty(body, API_RESPONSE_BRAND, { value: true, enumerable: false });

  return body;
}

/** 成功响应体（code 恒为 '0000'） */
export function createSuccessResponse<T>(data: T, message: string = '成功'): ApiResponse<T> {
  return brand({
    code: ErrorCode.SUCCESS,
    message,
    data
  });
}

/** 错误响应体（无 data 时返回 null） */
export function createErrorResponse<T = null>(
  codeKey: ErrorCodeKey,
  message: string,
  data?: NoInfer<T>
): ApiResponse<T> {
  return brand({
    code: ErrorCode[codeKey],
    message,
    data: data === undefined ? null : data
  });
}

/** 响应体是否由本文件的工厂函数产生（避免二次包装） */
export function isApiResponseStructure(data: unknown): data is ApiResponse {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  return Object.prototype.hasOwnProperty.call(data, API_RESPONSE_BRAND);
}
