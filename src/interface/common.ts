import { EnumRoutePath, EnumLoginModule } from '@/enum';

/** 路由描述 */
export interface RouteMeta {
  /** 路由名称 */
  title?: string;
  /** 页面100%视高 */
  fullPage?: boolean;
  /** 作为菜单 */
  asMenu?: boolean;
  /** 菜单和面包屑对应的图标 */
  icon?: string;
}

export type RoutePathKey = keyof typeof EnumRoutePath;
export type LoginModuleType = keyof typeof EnumLoginModule;
