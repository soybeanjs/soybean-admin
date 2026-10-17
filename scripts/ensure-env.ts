import { copyFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * 从 `.env.example` 派生本地 `.env`（缺了才拷，幂等）。
 *
 * `.env` 不再入库（审计 1.1：它曾把 `JWT_SECRET` 的可信占位符一起公开）；
 * 但 `env.mode: 'throw'` 下缺 `.env` 会让 dev / test / build 直接抛错，所以
 * 这三条路径都先跑本脚本。已存在的 `.env` 绝不覆盖 —— 那里是开发者自己的值。
 */
const rootDir = fileURLToPath(new URL('../', import.meta.url));
const exampleFile = `${rootDir}.env.example`;
const localFile = `${rootDir}.env`;

if (existsSync(localFile)) {
  process.exit(0);
}

if (!existsSync(exampleFile)) {
  console.error('[ensure-env] 缺少 .env.example，无法派生 .env');

  process.exit(1);
}

copyFileSync(exampleFile, localFile);
console.log('[ensure-env] 已从 .env.example 创建 .env（本地文件，不入库）');
