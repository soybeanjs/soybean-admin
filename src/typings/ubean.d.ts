import type { AuthUserDTO } from '@/schema/auth';

/** ubean Context 变量扩展（v3 §6.1）：鉴权中间件写入的用户上下文 详见 docs/v3-notes.md N-027。 */
declare module '@ubean/shared' {
  interface UbeanVariables {
    user: AuthUserDTO;
    userId: string;
  }
}

export {};
