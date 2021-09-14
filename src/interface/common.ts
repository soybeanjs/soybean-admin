import type { Component } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import type { MenuOption } from 'naive-ui';
import { EnumRoutePath, EnumLoginModule } from '@/enum';

/** 路由描述 */
interface RouteMeta {
  /** 路由名称 */
  title?: string;
  /** 页面100%视高 */
  fullPage?: boolean;
  /** 作为菜单 */
  asMenu?: boolean;
  /** 菜单和面包屑对应的图标 */
  icon?: Component;
}

export type CustomRoute = RouteRecordRaw & { meta: RouteMeta };

export type RoutePathKey = keyof typeof EnumRoutePath;

export type GlobalMenuOption = MenuOption & {
  routeName: string;
  routePath: string;
};

export type LoginModuleType = keyof typeof EnumLoginModule;
