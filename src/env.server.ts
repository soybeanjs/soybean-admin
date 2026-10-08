import { defineEnv } from '@ubean/shared';

/**
 * 服务端环境变量（校验 + 默认值）。
 *
 * 只在服务端代码里 import（`src/routes/**`、`src/services/**`、`src/db/**`、
 * `src/crons/**`、`src/middleware/**`）—— 浏览器里 `process` 不存在，
 * 客户端要用的变量请走 `src/env.ts`。
 *
 * `mode: 'throw'` 让缺失的必填项在启动期直接失败，而不是运行期才 500。
 */
const { env, validate } = defineEnv({
  mode: 'throw',
  server: {
    SERVER_HOST: { type: String, default: '0.0.0.0' },
    SERVER_PORT: { type: Number, default: 9527 },
    SERVER_INTERNAL_URL: { type: String, default: 'http://127.0.0.1:9527' },
    JWT_SECRET: { type: String, default: 'soybean-admin-v3-dev-secret-change-me' },
    JWT_EXPIRES_IN: { type: String, default: '1d' },
    REFRESH_TOKEN_EXPIRES_IN: { type: String, default: '7d' },
    DATABASE_URL: { type: String, default: '' },
    REDIS_URL: { type: String, default: '' },
    /** 多 baseURL 代理上游：`key=origin,key2=origin2`，见 src/shared/api-proxy.ts */
    API_PROXY_TARGETS: { type: String, default: '' }
  }
});

export const serverEnv = env;

/** 手动按给定来源校验（测试 / 脚本使用） */
export const validateServerEnv = validate;
