import type { RouteRecordRaw } from 'vue-router';
import { BlankLayout } from '@/layouts';
import type { LoginModuleType } from '@/interface';
import Login from '@/views/system/login/index.vue';
import NoPermission from '@/views/system/exception/403.vue';
import NotFound from '@/views/system/exception/404.vue';
import ServiceError from '@/views/system/exception/500.vue';
import { routeName, routePath, routeTitle } from '../const';

/**
 * 固定不变的路由
 * @description !最后一项重定向未找到的路由须放置路由的最后一项
 */
const constantRoutes: RouteRecordRaw[] = [
  {
    name: 'single_',
    path: '/single_',
    component: BlankLayout,
    redirect: { name: routeName('not-found') },
    meta: {
      keepAlive: true
    },
    children: [
      // 登录
      {
        name: routeName('login'),
        path: routePath('login'),
        component: Login,
        props: route => {
          const moduleType: LoginModuleType = (route.query?.module as LoginModuleType) || 'pwd-login';
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
