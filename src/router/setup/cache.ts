import { getCacheRoutes } from '@/utils';
import { routes } from '../routes';

/** 缓存的路由对应vue页面的名称 */
const cacheRoutes = getCacheRoutes(routes);

export default cacheRoutes;
