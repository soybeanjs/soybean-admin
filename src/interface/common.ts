import { EnumRoutePaths, EnumLoginModule } from '@/enum';

/** 路由描述 */
export interface RouteMeta {
  /** 页面100%视高 */
  fullPage?: boolean;
}

export type RoutePathKey = keyof typeof EnumRoutePaths;
export type LoginModuleType = keyof typeof EnumLoginModule;
