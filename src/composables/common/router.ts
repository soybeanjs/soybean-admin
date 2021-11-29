import { unref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import type { RouteLocationRaw } from 'vue-router';
import { router as globalRouter, routeName } from '@/router';
import type { LoginModuleType } from '@/interface';

/**
 * 路由跳转
 * @param inSetup - 是否在vue页面/组件的setup里面调用
 */
export function useRouterPush(inSetup: boolean = true) {
  const router = inSetup ? useRouter() : globalRouter;
  const route = inSetup ? useRoute() : unref(globalRouter.currentRoute);

  /** 跳转首页 */
  function toHome() {
    router.push('/');
  }

  /**
   * 重定向地址
   * - current: 取当前的path作为重定向地址
   */
  type LoginRedirect = 'current' | string;
  /**
   * 跳转登录页面(通过vue路由)
   * @param module - 展示的登录模块
   * @param redirect - 重定向地址(登录成功后跳转的地址)
   */
  function toLogin(module: LoginModuleType = 'pwd-login', redirect: LoginRedirect = 'current') {
    const routeLocation: RouteLocationRaw = {
      name: routeName('login'),
      params: { module }
    };
    if (redirect) {
      let url = redirect;
      if (redirect === 'current') {
        url = router.currentRoute.value.fullPath;
      }
      Object.assign(routeLocation, { query: { redirect: url } });
    }
    router.push(routeLocation);
  }

  /**
   * 登陆页跳转登陆页(登录模块切换)
   * @param module - 展示的登录模块
   * @param query - 查询参数
   */
  function toCurrentLogin(module: LoginModuleType) {
    const { query } = route;
    router.push({ name: routeName('login'), params: { module }, query: { ...query } });
  }

  /** 登录后跳转重定向的地址 */
  function toLoginRedirectUrl(path: string) {
    router.push(path);
  }

  return {
    toHome,
    toLogin,
    toCurrentLogin,
    toLoginRedirectUrl
  };
}
