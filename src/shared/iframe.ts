/** 只放行 `http:` / `https:`： 详见 docs/v3-notes.md N-145。 */
export function resolveExternalUrl(raw: unknown): string {
  if (typeof raw !== 'string' || raw.length === 0) {
    return '';
  }

  try {
    const parsed = new URL(raw);

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return '';
    }

    return parsed.toString();
  } catch {
    // 非绝对 URL（含相对路径、空串、乱码）—— 不是外链
    return '';
  }
}

/** 内嵌页地址：语义与 `resolveExternalUrl` 相同，单独命名以便阅读处自我说明 */
export const resolveIframeUrl = resolveExternalUrl;
