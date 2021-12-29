import { transformRouteToMenu, transformRouteToList } from '@/utils';
import customRoutes from '../modules';

/** 菜单 */
const menus = transformRouteToMenu(customRoutes);
/** 菜单搜索列表 */
const menusList = transformRouteToList(customRoutes);

export { menus, menusList };
