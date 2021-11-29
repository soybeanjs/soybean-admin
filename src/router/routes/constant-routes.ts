import type { RouteRecordRaw } from 'vue-router';
import { BlankLayout } from '@/layouts';
import type { LoginModuleType } from '@/interface';
import { Login, NoPermission, NotFound, ServiceError } from '@/views';
import { getLoginModuleRegExp } from '@/utils';
import { routeName, routePath, routeTitle } from '../constant';
import { ROUTE_HOME_NAME } from './route-home';

/**
 * 固定不变的路由
 * @description !最后一项重定向未找到的路由须放置路由的最后一项
 */
const constantRoutes: RouteRecordRaw[] = [
  {
    name: routeName('root'),
    path: routePath('root'),
    redirect: { name: ROUTE_HOME_NAME }
  },
  {
    // 名称、路径随意，不在路由声明里面，只是为各个子路由充当应用BlankLayout布局的桥梁，因此访问该路由时重定向到404
    name: 'constant-single_',
    path: '/constant-single_',
    component: BlankLayout,
    redirect: { name: routeName('not-found') },
    meta: {
      title: 'constant-single_',
      keepAlive: true
    },
    children: [
      // 登录
      {
        name: routeName('login'),
        path: `${routePath('login')}/:module(${getLoginModuleRegExp()})?`,
        component: Login,
        props: route => {
          const moduleType = (route.params.module as LoginModuleType) || 'pwd-login';
          return {
            module: moduleType
          };
        },
        meta: {
          title: routeTitle('login'),
          fullPage: true
        }
      },
      // 403
      {
        name: routeName('no-permission'),
        path: routePath('no-permission'),
        component: NoPermission,
        meta: {
          title: routeTitle('no-permission'),
          fullPage: true
        }
      },
      // 404
      {
        name: routeName('not-found'),
        path: routePath('not-found'),
        component: NotFound,
        meta: {
          title: routeTitle('not-found'),
          fullPage: true
        }
      },
      // 500
      {
        name: routeName('service-error'),
        path: routePath('service-error'),
        component: ServiceError,
        meta: {
          title: routeTitle('service-error'),
          fullPage: true
        }
      }
    ]
  },
  // 匹配无效的路径重定向404
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: routeName('not-found') }
  }
];

export default constantRoutes;
