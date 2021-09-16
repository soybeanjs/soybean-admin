import { useRouter, useRoute } from 'vue-router';
import type { RouteLocationRaw } from 'vue-router';
import { router as globalRouter, RouteNameMap } from '@/router';
import type { LoginModuleType } from '@/interface';

interface LoginRedirect {
  /**
   * 重定向类型
   * - current: 取当前的地址作为重定向地址
   * - custom: 自定义地址作为重定向地址
   */
  type: 'current' | 'custom' | 'no';
  /** 自定义地址 */
  url: string;
}

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
   * @param addRedirect - 是否添加重定向地址
   * @param redirect - 登录后重定向相关配置
   */
  function toLogin(
    module: LoginModuleType = 'pwd-login',
    addRedirect: boolean = false,
    redirect: LoginRedirect = { type: 'current', url: '' }
  ) {
    const redirectUrl = redirect.type === 'current' ? window.location.href : redirect.url;
    const routeLocation: RouteLocationRaw = {
      name: RouteNameMap.get('login'),
      params: { module }
    };
    if (addRedirect) {
      routeLocation.query = { redirectUrl };
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
      router.push({ name: RouteNameMap.get('login'), params: { module }, query });
    }
  }

  return {
    toHome,
    toLogin,
    toCurrentLogin
  };
}
