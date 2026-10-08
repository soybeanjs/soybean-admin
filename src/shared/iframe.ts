/**
 * 外链 / 内嵌页地址解析（P3-07）。
 *
 * 纯函数，被三处共用：`src/pages/(builtin)/iframe/index.vue`（内嵌页 `?url=`）、
 * `src/layouts/default.vue` 的 `onMenuSelect`（`menuType: 'link'` 的新窗口打开）、
 * 以及单测。
 *
 * 为什么放在 `src/shared/`：布局、页面、测试都要同一份判定；写在组件里就变成
 * 「每个使用点各写一遍正则」，迟早漂移。
 *
 * 只放行 `http:` / `https:`：
 * - `javascript:` 在 `iframe.src` / `window.open` 上会被浏览器拦截，但属于
 *   典型的注入面，必须在数据入口就砍掉；
 * - `data:` / `blob:` 可能被当成下载或渲染本地内容，一律不接受；
 * - 相对路径（`/foo`）不是外链语义，同样拒绝 —— 内部导航请用 `path`。
 */
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
