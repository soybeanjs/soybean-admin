export function setLocal(key: string, value: unknown) {
  const json = JSON.stringify(value);
  localStorage.setItem(key, json);
}

export function getLocal<T>(key: string) {
  const json = localStorage.getItem(key);
  if (json) {
    return JSON.parse(json) as T;
  }
  return json;
}
