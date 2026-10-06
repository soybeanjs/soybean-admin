import { spawn } from 'node:child_process';
import type { ChildProcess } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE_URL = 'http://localhost:9527';

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
  child = spawn('pnpm', ['dev'], {
    cwd: new URL('..', import.meta.url).pathname,
    detached: true,
    stdio: 'ignore'
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
