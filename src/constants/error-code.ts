/**
 * 业务错误码表（v3 §6.1 统一响应契约）。
 *
 * 响应格式恒为 `{ code, message, data }`：`0000` 表示成功，其余为业务码。
 * HTTP 状态码只表达传输层结果（业务错误同样返回 200），前端按 code 分类处理。
 *
 * 分段约定（与 soybean-unify 对齐）：
 * - `0000` 成功
 * - `1000-1999` 系统错误
 * - `2000-2999` 认证错误
 * - `3000-3999` 参数错误
 * - `4000-4999` 业务错误（资源 / 权限 / 限流 / 数据一致性）
 * - `8888 / 7777 / 9999` 演示码（登出 / 弹窗登出 / 过期刷新），供前端错误处理演示页使用
 */
export const ErrorCode = {
  /** 成功 */
  SUCCESS: '0000',

  // 系统错误 (1000-1999)
  /** 系统错误 */
  SYSTEM_ERROR: '1000',
  /** 数据库错误 */
  DATABASE_ERROR: '1001',
  /** 缓存错误 */
  CACHE_ERROR: '1002',
  /** 文件错误 */
  FILE_ERROR: '1003',
  /** 网络错误 */
  NETWORK_ERROR: '1004',

  // 认证错误 (2000-2999)
  /** 未授权 */
  UNAUTHORIZED: '2000',
  /** 令牌过期 */
  TOKEN_EXPIRED: '2001',
  /** 令牌无效 */
  TOKEN_INVALID: '2002',
  /** 令牌黑名单 */
  TOKEN_BLACKLISTED: '2003',
  /** 刷新令牌无效 */
  REFRESH_TOKEN_INVALID: '2004',
  /** 刷新令牌过期 */
  REFRESH_TOKEN_EXPIRED: '2005',
  /** 刷新令牌黑名单 */
  REFRESH_TOKEN_BLACKLISTED: '2006',
  /** 用户未找到 */
  USER_NOT_FOUND: '2007',
  /** 用户禁用 */
  USER_DISABLED: '2008',
  /** 密码无效 */
  PASSWORD_INVALID: '2009',
  /** 用户名已存在 */
  USERNAME_EXISTS: '2010',
  /** 邮箱已存在 */
  EMAIL_EXISTS: '2011',

  // 参数错误 (3000-3999)
  /** 参数无效 */
  PARAM_INVALID: '3000',
  /** 参数缺失 */
  PARAM_MISSING: '3001',
  /** 参数类型错误 */
  PARAM_TYPE_ERROR: '3002',
  /** 参数长度错误 */
  PARAM_LENGTH_ERROR: '3003',
  /** 参数格式错误 */
  PARAM_FORMAT_ERROR: '3004',

  // 业务错误 (4000-4999)
  /** 资源未找到 */
  RESOURCE_NOT_FOUND: '4000',
  /** 资源已存在 */
  RESOURCE_EXISTS: '4001',
  /** 操作不允许 */
  OPERATION_NOT_ALLOWED: '4002',
  /** 权限拒绝 */
  PERMISSION_DENIED: '4003',
  /** 速率限制超出 */
  RATE_LIMIT_EXCEEDED: '4004',
  /** 资源已过期 */
  RESOURCE_EXPIRED: '4005',
  /** 资源状态错误 */
  RESOURCE_STATE_ERROR: '4006',
  /** 操作冲突 */
  OPERATION_CONFLICT: '4007',
  /** 数据一致性错误 */
  DATA_CONSISTENCY_ERROR: '4008',

  // 用户相关业务错误 (4100-4199)
  /** 用户资料不完整 */
  USER_PROFILE_INCOMPLETE: '4100',
  /** 用户已被锁定 */
  USER_LOCKED: '4101',
  /** 登录失败次数过多 */
  LOGIN_ATTEMPTS_EXCEEDED: '4102',

  // 数据相关业务错误 (4200-4299)
  /** 数据关联错误 */
  DATA_RELATION_ERROR: '4200',
  /** 数据已被引用 */
  DATA_REFERENCED: '4201',
  /** 数据不一致 */
  DATA_INCONSISTENT: '4202',

  // 演示码（供前端 onBackendFail 分类演示，不参与真实业务）
  /** 演示：直接登出 */
  DEMO_LOGOUT: '8888',
  /** 演示：弹窗登出 */
  DEMO_MODAL_LOGOUT: '7777',
  /** 演示：刷新令牌 */
  DEMO_REFRESH_TOKEN: '9999'
} as const;

export type ErrorCodeKey = keyof typeof ErrorCode;

export type ErrorCodeValue = (typeof ErrorCode)[ErrorCodeKey];

export const defaultErrorMessages: Record<ErrorCodeKey, string> = {
  SUCCESS: '操作成功',

  // 系统错误
  SYSTEM_ERROR: '系统错误，请稍后重试',
  DATABASE_ERROR: '数据库操作失败，请稍后重试',
  CACHE_ERROR: '缓存操作失败，请稍后重试',
  FILE_ERROR: '文件操作失败，请稍后重试',
  NETWORK_ERROR: '网络错误，请稍后重试',

  // 认证错误
  UNAUTHORIZED: '未授权，请先登录',
  TOKEN_EXPIRED: '令牌已过期，请重新登录',
  TOKEN_INVALID: '令牌无效，请重新登录',
  TOKEN_BLACKLISTED: '令牌已失效，请重新登录',
  REFRESH_TOKEN_INVALID: '刷新令牌无效，请重新登录',
  REFRESH_TOKEN_EXPIRED: '刷新令牌已过期，请重新登录',
  REFRESH_TOKEN_BLACKLISTED: '刷新令牌已失效，请重新登录',
  USER_NOT_FOUND: '用户不存在',
  USER_DISABLED: '用户已禁用',
  PASSWORD_INVALID: '用户名或密码错误',
  USERNAME_EXISTS: '用户名已存在',
  EMAIL_EXISTS: '邮箱已存在',

  // 参数错误
  PARAM_INVALID: '参数无效',
  PARAM_MISSING: '参数缺失',
  PARAM_TYPE_ERROR: '参数类型错误',
  PARAM_LENGTH_ERROR: '参数长度错误',
  PARAM_FORMAT_ERROR: '参数格式错误',

  // 业务错误
  RESOURCE_NOT_FOUND: '资源不存在',
  RESOURCE_EXISTS: '资源已存在',
  OPERATION_NOT_ALLOWED: '操作不允许',
  PERMISSION_DENIED: '没有操作权限',
  RATE_LIMIT_EXCEEDED: '请求过于频繁，请稍后重试',
  RESOURCE_EXPIRED: '资源已过期',
  RESOURCE_STATE_ERROR: '资源状态错误',
  OPERATION_CONFLICT: '操作冲突',
  DATA_CONSISTENCY_ERROR: '数据一致性错误',

  // 用户相关业务错误
  USER_PROFILE_INCOMPLETE: '用户资料不完整',
  USER_LOCKED: '用户已被锁定',
  LOGIN_ATTEMPTS_EXCEEDED: '登录失败次数过多，请稍后重试',

  // 数据相关业务错误
  DATA_RELATION_ERROR: '数据关联错误',
  DATA_REFERENCED: '数据已被引用，无法删除',
  DATA_INCONSISTENT: '数据不一致',

  // 演示码
  DEMO_LOGOUT: '演示错误：触发登出',
  DEMO_MODAL_LOGOUT: '演示错误：触发弹窗登出',
  DEMO_REFRESH_TOKEN: '演示错误：触发刷新令牌'
};

/** 演示码 -> 错误码键（`POST /api/auth/error` 用 query.code 透传演示码） */
export const demoErrorCodeMap: Record<string, ErrorCodeKey> = {
  [ErrorCode.DEMO_LOGOUT]: 'DEMO_LOGOUT',
  [ErrorCode.DEMO_MODAL_LOGOUT]: 'DEMO_MODAL_LOGOUT',
  [ErrorCode.DEMO_REFRESH_TOKEN]: 'DEMO_REFRESH_TOKEN'
};
