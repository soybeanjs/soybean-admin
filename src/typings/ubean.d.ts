import type { AuthUserDTO } from '@/schema/auth';

/**
 * ubean Context 变量扩展（v3 §6.1）：鉴权中间件写入的用户上下文。
 *
 * `c.set('user'/'userId')` 在 01.auth.ts 中写入，
 * 路由处理器经 `c.get('userId')` 读取当前登录用户。
 */
declare module '@ubean/shared' {
  interface UbeanVariables {
    user: AuthUserDTO;
    userId: string;
  }
}

export {};
