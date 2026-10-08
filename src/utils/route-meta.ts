import type { RouteMeta } from 'vue-router';
import type { AppRouteMeta } from '@/typings/app';

/**
 * `RouteMeta`（继承 `Record<PropertyKey, unknown>`，取值是 unknown）→
 * `AppRouteMeta` 的单一受信边界：逐字段运行时收窄，无 as 断言。
 *
 * vue-router 的 RouteMeta 带全量 unknown 索引签名，整对象直接赋给
 * AppRouteMeta 在结构上不可赋值（unknown ↛ string|undefined），字段访问
 * 却又拿不到具体类型 —— 用本函数一次收窄，全仓只此一处。
 */
export function toAppRouteMeta(meta: RouteMeta): AppRouteMeta {
  return {
    title: typeof meta.title === 'string' ? meta.title : undefined,
    i18nKey: typeof meta.i18nKey === 'string' ? meta.i18nKey : undefined,
    icon: typeof meta.icon === 'string' ? meta.icon : undefined,
    order: typeof meta.order === 'number' ? meta.order : undefined,
    hideInMenu: typeof meta.hideInMenu === 'boolean' ? meta.hideInMenu : undefined,
    roles: Array.isArray(meta.roles)
      ? meta.roles.filter((role): role is string => typeof role === 'string')
      : undefined,
    activeMenu: typeof meta.activeMenu === 'string' ? meta.activeMenu : undefined,
    cache: typeof meta.cache === 'boolean' ? meta.cache : undefined,
    multiTab: typeof meta.multiTab === 'boolean' ? meta.multiTab : undefined,
    pinned: typeof meta.pinned === 'boolean' ? meta.pinned : undefined,
    menuId: typeof meta.menuId === 'string' ? meta.menuId : undefined,
    layout: typeof meta.layout === 'string' ? meta.layout : undefined
  };
}
