import type { RouteRecordRaw } from 'vue-router';
import { Dashboard, Menu } from '@vicons/carbon';
import { ExceptionOutlined } from '@vicons/antd';
import { BasicLayout, BlankLayout, MultiMenuLayout } from '@/layouts';
import { EnumRoutePath, EnumRouteTitle } from '@/enum';
import type { CustomRoute, LoginModuleType } from '@/interface';
import { getLoginModuleRegExp } from '@/utils';
import {
  Login,
  NoPermission,
  NotFound,
  ServiceError,
  DashboardAnalysis,
  DashboardWorkbench,
  MultimenuFirstSecond,
  Exception403,
  Exception404,
  Exception500
} from './components';
import { getRouteNameMap } from './helpers';

/** 路由名称 */
export const RouteNameMap = getRouteNameMap();

/** 登录模块的正则字符串 */
const loginModuleRegExp = getLoginModuleRegExp();

/**
 * 固定不变的路由
 * @description !最后一项重定向未找到的路由须放置路由的最后一项
 */
const constantRoutes: RouteRecordRaw[] = [
  {
    name: RouteNameMap.get('system'),
    path: EnumRoutePath.system,
    component: BlankLayout,
    redirect: { name: RouteNameMap.get('not-found') },
    meta: {
      keepAlive: true,
      title: EnumRouteTitle.system
    },
    children: [
      // 登录
      {
        name: RouteNameMap.get('login'),
        path: `${EnumRoutePath.login}/:module(/${loginModuleRegExp}/)?`,
        component: Login,
        props: route => {
          const moduleType: LoginModuleType = (route.params.module as LoginModuleType) || 'pwd-login';
          return {
            module: moduleType
          };
        },
        meta: {
          title: EnumRouteTitle.login,
          fullPage: true
        }
      },
      // 403
      {
        name: RouteNameMap.get('no-permission'),
        path: EnumRoutePath['no-permission'],
        component: NoPermission,
        meta: {
          title: EnumRouteTitle['no-permission'],
          fullPage: true
        }
      },
      // 404
      {
        name: RouteNameMap.get('not-found'),
        path: EnumRoutePath['not-found'],
        component: NotFound,
        meta: {
          title: EnumRouteTitle['not-found'],
          fullPage: true
        }
      },
      // 500
      {
        name: RouteNameMap.get('service-error'),
        path: EnumRoutePath['service-error'],
        component: ServiceError,
        meta: {
          title: EnumRouteTitle['service-error'],
          fullPage: true
        }
      }
    ]
  },
  // 匹配无效的路径重定向404
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'not-found' }
  }
];

/** 路由首页 */
export const ROUTE_HOME: CustomRoute = {
  name: RouteNameMap.get('dashboard-analysis'),
  path: EnumRoutePath['dashboard-analysis'],
  component: DashboardAnalysis,
  meta: {
    keepAlive: true,
    requiresAuth: true,
    title: EnumRouteTitle['dashboard-analysis']
  }
};

/**
 * 自定义路由
 */
export const customRoutes: CustomRoute[] = [
  {
    name: RouteNameMap.get('root'),
    path: EnumRoutePath.root,
    component: BasicLayout,
    redirect: { name: ROUTE_HOME.name },
    meta: {
      isNotMenu: true
    }
  },
  {
    name: RouteNameMap.get('dashboard'),
    path: EnumRoutePath.dashboard,
    component: BasicLayout,
    redirect: { name: RouteNameMap.get('dashboard-analysis') },
    meta: {
      title: EnumRouteTitle.dashboard,
      icon: Dashboard
    },
    children: [
      ROUTE_HOME,
      {
        name: RouteNameMap.get('dashboard-workbench'),
        path: EnumRoutePath['dashboard-workbench'],
        component: DashboardWorkbench,
        meta: {
          keepAlive: true,
          requiresAuth: true,
          title: EnumRouteTitle['dashboard-workbench']
        }
      }
    ]
  },
  {
    name: RouteNameMap.get('exception'),
    path: EnumRoutePath.exception,
    component: BasicLayout,
    redirect: { name: RouteNameMap.get('exception-403') },
    meta: {
      requiresAuth: true,
      title: EnumRouteTitle.exception,
      icon: ExceptionOutlined
    },
    children: [
      {
        name: RouteNameMap.get('exception-403'),
        path: EnumRoutePath['exception-403'],
        component: Exception403,
        meta: {
          requiresAuth: true,
          title: EnumRouteTitle['exception-403'],
          fullPage: true
        }
      },
      {
        name: RouteNameMap.get('exception-404'),
        path: EnumRoutePath['exception-404'],
        component: Exception404,
        meta: {
          requiresAuth: true,
          title: EnumRouteTitle['exception-404'],
          fullPage: true
        }
      },
      {
        name: RouteNameMap.get('exception-500'),
        path: EnumRoutePath['exception-500'],
        component: Exception500,
        meta: {
          requiresAuth: true,
          title: EnumRouteTitle['exception-500'],
          fullPage: true
        }
      }
    ]
  },
  {
    name: RouteNameMap.get('multimenu'),
    path: EnumRoutePath.multimenu,
    component: BasicLayout,
    redirect: { name: RouteNameMap.get('multimenu-first') },
    meta: {
      title: EnumRouteTitle.multimenu,
      icon: Menu
    },
    children: [
      {
        name: RouteNameMap.get('multimenu-first'),
        path: EnumRoutePath['multimenu-first'],
        component: MultiMenuLayout,
        redirect: { name: RouteNameMap.get('multimenu-first-second') },
        meta: {
          keepAlive: true,
          requiresAuth: true,
          title: EnumRouteTitle['multimenu-first']
        },
        children: [
          {
            name: RouteNameMap.get('multimenu-first-second'),
            path: EnumRoutePath['multimenu-first-second'],
            component: MultimenuFirstSecond,
            meta: {
              keepAlive: true,
              requiresAuth: true,
              title: EnumRouteTitle['multimenu-first-second']
            }
          }
        ]
      }
    ]
  }
];

/** 所有路由 */
export const routes: RouteRecordRaw[] = [...customRoutes, ...constantRoutes];
