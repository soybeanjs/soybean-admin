import { EnumStorageKey } from '@/enum';
import type { GlobalTabRoute } from '@/interface';
import { setLocal, getLocal } from '../storage';

/** 缓存多页签数据 */
export function setTabRoutes(data: GlobalTabRoute[]) {
  setLocal(EnumStorageKey['tab-routes'], data);
}

/** 获取缓存的多页签数据 */
export function getTabRoutes() {
  const routes: GlobalTabRoute[] = [];
  const data = getLocal<GlobalTabRoute[]>(EnumStorageKey['tab-routes']);
  if (data) {
    const defaultTabRoutes = data.map(item => ({
      ...item,
      scrollPosition: {
        left: 0,
        top: 0
      }
    }));
    routes.push(...defaultTabRoutes);
  }
  return routes;
}

/** 清空多页签数据 */
export function clearTabRoutes() {
  setTabRoutes([]);
}
