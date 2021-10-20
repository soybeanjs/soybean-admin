import type { RouteRecordRaw } from 'vue-router';
import { EnumRoutePath, EnumRouteTitle } from '@/enum';
import { BlankLayout } from '@/layouts';
import type { LoginModuleType } from '@/interface';
import { RouteNameMap } from '../helpers';
import { Login, NoPermission, NotFound, ServiceError } from '../components';

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
        path: EnumRoutePath.login,
        component: Login,
        props: route => {
          const moduleType: LoginModuleType = (route.query?.module as LoginModuleType) || 'pwd-login';
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

export default constantRoutes;
