/** 默认缓存期限为7天 */
const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7;

export function setLocal(key: string, value: unknown, expire: number | null = DEFAULT_CACHE_TIME) {
  const json = JSON.stringify({ value, expire: expire !== null ? new Date().getTime() + expire * 1000 : null });
  window.localStorage.setItem(key, json);
}

export function getLocal<T>(key: string) {
  const json = window.localStorage.getItem(key);
  if (json) {
    const data = JSON.parse(json);
    const { value, expire } = data;
    /** 在有效期内直接返回 */
    if (expire === null || expire >= Date.now()) {
      return value as T;
    }
    removeLocal(key);
  }
  return null;
}

export function removeLocal(key: string) {
  window.localStorage.removeItem(key);
}

export function clearLocal() {
  window.localStorage.clear();
}
