export function setLocal(key: string, value: unknown) {
  const json = JSON.stringify(value);
  window.localStorage.setItem(key, json);
}

export function getLocal<T>(key: string) {
  const json = window.localStorage.getItem(key);
  if (json) {
    return JSON.parse(json) as T;
  }
  return json;
}

export function removeLocal(key: string) {
  window.localStorage.removeItem(key);
}
