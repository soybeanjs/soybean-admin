export function setSession(key: string, value: unknown) {
  const json = JSON.stringify(value);
  sessionStorage.setItem(key, json);
}

export function getSession<T>(key: string) {
  const json = sessionStorage.getItem(key);
  if (json) {
    return JSON.parse(json) as T;
  }
  return null;
}

export function removeSession(key: string) {
  window.sessionStorage.removeItem(key);
}

export function clearSession() {
  window.sessionStorage.clear();
}
