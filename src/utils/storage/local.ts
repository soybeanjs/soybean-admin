import { encrypto, decrypto } from '../crypto';

interface StorageData {
  value: unknown;
  expire: number | null;
}

/** 默认缓存期限为7天 */
const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7;

export function setLocal(key: string, value: unknown, expire: number | null = DEFAULT_CACHE_TIME) {
  const storageData: StorageData = { value, expire: expire !== null ? new Date().getTime() + expire * 1000 : null };
  const json = encrypto(storageData);
  window.localStorage.setItem(key, json);
}

export function getLocal<T>(key: string) {
  const json = window.localStorage.getItem(key);
  if (json) {
    let storageData: StorageData | null = null;
    try {
      storageData = decrypto(json);
    } catch {
      // 防止解析失败
    }
    if (storageData) {
      const { value, expire } = storageData;
      // 在有效期内直接返回
      if (expire === null || expire >= Date.now()) {
        return value as T;
      }
    }
    removeLocal(key);
    return null;
  }
  return null;
}

export function removeLocal(key: string) {
  window.localStorage.removeItem(key);
}

export function clearLocal() {
  window.localStorage.clear();
}
