import { spawn } from 'node:child_process';
import type { ChildProcess } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';

/**
 * 与 `vite.config.ts` 的 `devPort` 共用同一个来源：`DEV_PORT` 环境变量。
 *
 * 默认 9527（对齐 `.env` 的 `SERVER_PORT`）。`git worktree` 并行开发时用
 * `DEV_PORT=9530 pnpm test` 错开端口，否则两个 worktree 的集成测试会互相复用
 * 对方的 dev server。
 */
const DEV_PORT = process.env.DEV_PORT ?? '9527';
const BASE_URL = `http://localhost:${DEV_PORT}`;

async function isUp(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/api/system/health`);

    return res.ok;
  } catch {
    return false;
  }
}

async function waitForUp(timeoutMs: number): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    if (await isUp()) return true;
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return false;
}

let child: ChildProcess | null = null;

export async function setup(): Promise<() => Promise<void>> {
  if (await isUp()) {
    // 复用外部 dev server（如开发者本机已跑 `pnpm dev`）
    writeFileSync(new URL('./baseUrl.txt', import.meta.url), BASE_URL);

    return async () => {};
  }

  // 自起 dev server（测试专用实例）
  // 显式透传 `DEV_PORT`，否则 `pnpm dev` 落回 `vite.config.ts` 的默认 9527，
  // 而 `BASE_URL` 已经指向别的端口，`waitForUp` 会一直超时。
  child = spawn('pnpm', ['dev'], {
    cwd: new URL('..', import.meta.url).pathname,
    detached: true,
    stdio: 'ignore',
    env: { ...process.env, DEV_PORT }
  });

  mkdirSync(new URL('.', import.meta.url), { recursive: true });
  writeFileSync(new URL('./baseUrl.txt', import.meta.url), BASE_URL);

  const up = await waitForUp(90_000);

  if (!up) {
    throw new Error(`dev server 未能在 90s 内就绪（${BASE_URL}）`);
  }

  return async () => {
    if (child?.pid) {
      try {
        process.kill(-child.pid);
      } catch {
        // 已退出则忽略
      }
    }
  };
}
