import { env } from '@/env';

/**
 * SSR 安全的 localStorage 封装。
 *
 * ubean 是全栈框架（SSR），store 初始化会在服务端执行 —— 直接碰
 * `localStorage` 会炸。所有存取都先判「有没有 localStorage」。
 * key 统一加 `VITE_STORAGE_PREFIX` 前缀，避免同域多应用互踩。
 *
 * ⚠️ 判据是**能力检测**，不是 `import.meta.client`（P4-02 实测教训）。
 * ubean 0.6.0 从不定义 `import.meta.client` / `import.meta.server`：dev
 * 按需转换的模块与 `vp build` 的产物里都原样留下 `import.meta.client`，
 * 浏览器求值即 `undefined`。用它当判据会让 `isClient()` 恒假 → 全应用
 * **静默丢掉所有 localStorage 读写**：token / 用户信息 / 主题设置 / 页签
 * 全部刷新即失，且不报错。同源教训见 `src/router/guard.ts` 与
 * `src/shared/i18n.ts`（都用能力检测）。
 */

const PREFIX = env.storagePrefix;

export function isClient(): boolean {
  return typeof localStorage !== 'undefined';
}

export function getLocal(key: string): string | null {
  if (!isClient()) return null;

  return localStorage.getItem(`${PREFIX}${key}`);
}

export function setLocal(key: string, value: string): void {
  if (!isClient()) return;

  localStorage.setItem(`${PREFIX}${key}`, value);
}

export function removeLocal(key: string): void {
  if (!isClient()) return;

  localStorage.removeItem(`${PREFIX}${key}`);
}

/** localStorage JSON 的受信边界：内容由本应用写入，结构约定由调用方泛型声明。
 * 集中在此做一次「信任」，避免调用处散落 as 断言（lint 规则禁止） */
function trustJson<T>(_value: unknown): _value is T {
  return true;
}

/** 存取 JSON 值（损坏数据静默回落 null，等价于不存在） */
export function getLocalJson<T>(key: string): T | null {
  const raw = getLocal(key);
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);

    return trustJson<T>(parsed) ? parsed : null;
  } catch {
    removeLocal(key);
    return null;
  }
}

export function setLocalJson(key: string, value: unknown): void {
  setLocal(key, JSON.stringify(value));
}
