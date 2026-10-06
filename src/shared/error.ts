import { ErrorCode, defaultErrorMessages } from '@/constants/error-code';
import type { ErrorCodeKey, ErrorCodeValue } from '@/constants/error-code';
import { createErrorResponse } from './response';
import type { ApiResponse } from './response';

/**
 * 应用错误类（v3 §6.1）：携带业务码键的结构化错误。
 *
 * handler / service 中 `throw new AppError('RESOURCE_NOT_FOUND', '...')`，
 * 由全局错误中间件（src/middleware/03.error.ts 经 onError）统一转成
 * `{ code, message, data: null }` 响应。
 */
export class AppError extends Error {
  /** 业务错误码键（运行时经 ErrorCode 映射为业务码字符串） */
  codeKey: ErrorCodeKey;

  /** 原始错误（保留调用链） */
  cause?: Error;

  constructor(codeKey: ErrorCodeKey, message: string = defaultErrorMessages[codeKey], cause?: Error) {
    super(message);
    this.name = 'AppError';
    this.codeKey = codeKey;
    this.cause = cause;

    if (cause?.stack) {
      this.stack = `${this.stack}\nCaused by: ${cause.stack}`;
    }
  }

  /** 业务码字符串（如 '4000'） */
  get code(): ErrorCodeValue {
    return ErrorCode[this.codeKey];
  }

  toResponse(): ApiResponse<null> {
    return createErrorResponse(this.codeKey, this.message);
  }

  static isAppError(error: unknown): error is AppError {
    return error instanceof AppError;
  }

  /** 把任意抛出值归一为 AppError：AppError 原样返回；Error 包装（保留 stack）；其余按消息字符串包装 */
  static from(error: unknown, defaultCodeKey: ErrorCodeKey = 'SYSTEM_ERROR', defaultMessage?: string): AppError {
    if (AppError.isAppError(error)) {
      return error;
    }

    if (error instanceof Error) {
      return new AppError(
        defaultCodeKey,
        error.message || defaultMessage || defaultErrorMessages[defaultCodeKey],
        error
      );
    }

    return new AppError(
      defaultCodeKey,
      typeof error === 'string' ? error : defaultMessage || defaultErrorMessages[defaultCodeKey]
    );
  }
}
