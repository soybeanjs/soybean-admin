import type { RouteMeta } from 'vue-router';
import type { AppRouteMeta } from '@/typings/app';

/** `RouteMeta`（继承 `Record<PropertyKey, unknown>`，取值是 unknown）→ 详见 docs/v3-notes.md N-288。 */
export function toAppRouteMeta(meta: RouteMeta): AppRouteMeta {
  return {
    pageName: typeof meta.pageName === 'string' ? meta.pageName : undefined,
    title: typeof meta.title === 'string' ? meta.title : undefined,
    i18nKey: typeof meta.i18nKey === 'string' ? meta.i18nKey : undefined,
    icon: typeof meta.icon === 'string' ? meta.icon : undefined,
    order: typeof meta.order === 'number' ? meta.order : undefined,
    hideInMenu: typeof meta.hideInMenu === 'boolean' ? meta.hideInMenu : undefined,
    roles: Array.isArray(meta.roles)
      ? meta.roles.filter((role): role is string => typeof role === 'string')
      : undefined,
    activeMenu: typeof meta.activeMenu === 'string' ? meta.activeMenu : undefined,
    menuParent: typeof meta.menuParent === 'string' ? meta.menuParent : undefined,
    cache: typeof meta.cache === 'boolean' ? meta.cache : undefined,
    multiTab: typeof meta.multiTab === 'boolean' ? meta.multiTab : undefined,
    pinned: typeof meta.pinned === 'boolean' ? meta.pinned : undefined,
    href: typeof meta.href === 'string' ? meta.href : undefined,
    iframeUrl: typeof meta.iframeUrl === 'string' ? meta.iframeUrl : undefined,
    menuId: typeof meta.menuId === 'string' ? meta.menuId : undefined,
    layout: typeof meta.layout === 'string' ? meta.layout : undefined
  };
}
