import { useRouter, useRoute } from 'vue-router';
import type { RouteLocationRaw } from 'vue-router';
import { EnumRoutePath } from '@/enum';
import { router as globalRouter } from '@/router';
import type { LoginModuleType } from '@/interface';

/**
 * 重定向地址
 * - current: 取当前的path作为重定向地址
 */
type LoginRedirect = 'current' | EnumRoutePath;

/**
 * 路由跳转
 * @param inSetup - 是否在vue页面/组件的setup里面调用
 */
export default function useRouterChange(inSetup: boolean = true) {
  const router = inSetup ? useRouter() : globalRouter;
  const route = inSetup ? useRoute() : null;

  /** 跳转首页 */
  function toHome() {
    router.push('/');
  }

  /**
   * 跳转登录页面(通过vue路由)
   * @param module - 展示的登录模块
   * @param redirectUrl - 重定向地址
   */
  function toLogin(module: LoginModuleType = 'pwd-login', redirectUrl: LoginRedirect = 'current') {
    const routeLocation: RouteLocationRaw = {
      path: EnumRoutePath.login,
      query: { module }
    };
    if (redirectUrl) {
      let url = redirectUrl;
      if (redirectUrl === 'current') {
        url = router.currentRoute.value.fullPath as EnumRoutePath;
      }
      routeLocation.query!.redirectUrl = url;
    }
    router.push(routeLocation);
  }

  /**
   * 登陆页跳转登陆页
   * @param module - 展示的登录模块
   * @param query - 查询参数
   */
  function toCurrentLogin(module: LoginModuleType) {
    if (route) {
      const { query } = route;
      router.push({ path: EnumRoutePath.login, query: { ...query, module } });
    }
  }

  /** 登录后跳转重定向的地址 */
  function toLoginRedirectUrl(path: EnumRoutePath) {
    router.push(path);
  }

  return {
    toHome,
    toLogin,
    toCurrentLogin,
    toLoginRedirectUrl
  };
}
