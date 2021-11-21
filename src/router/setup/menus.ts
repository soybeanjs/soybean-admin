import { transformRouteToMenu } from '@/utils';
import customRoutes from '../modules';

/** 菜单 */
const menus = transformRouteToMenu(customRoutes);

export default menus;
