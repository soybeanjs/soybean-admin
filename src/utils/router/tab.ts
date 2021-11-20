import { EnumStorageKey } from '@/enum';
import type { MultiTabRoute } from '@/interface';
import { setLocal, getLocal } from '../storage';

/** 缓存多页签数据 */
export function setTabRouteStorage(data: MultiTabRoute[]) {
  setLocal(EnumStorageKey['tab-route'], data);
}

/** 获取缓存的多页签数据 */
export function getTabRouteStorage() {
  const routes: MultiTabRoute[] = [];
  const data = getLocal<MultiTabRoute[]>(EnumStorageKey['tab-route']);
  if (data) {
    routes.push(...data);
  }
  return routes;
}

/** 清空多页签数据 */
export function clearTabRoutes() {
  setTabRouteStorage([]);
}
