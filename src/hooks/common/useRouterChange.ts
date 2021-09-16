import { useRouter } from 'vue-router';
import { router as globalRouter, RouteNameMap } from '@/router';
import type { LoginModuleType } from '@/interface';

interface LoginRedirect {
  /**
   * 重定向类型
   * - current: 取当前的地址作为重定向地址
   * - custom: 自定义地址作为重定向地址
   */
  type: 'current' | 'custom';
  /** 自定义地址 */
  url: string;
}

/**
 * 路由跳转
 * @param inSetup - 是否在vue页面/组件的setup里面调用
 */
export default function useRouterChange(inSetup: boolean = true) {
  const router = inSetup ? useRouter() : globalRouter;

  /** 跳转首页 */
  function toHome() {
    router.push('/');
  }

  /**
   * 跳转登录页面(通过vue路由)
   * @param module - 展示的登录模块
   * @param redirect - 登录后重定向相关配置
   */
  function toLogin(module: LoginModuleType = 'pwd-login', redirect: LoginRedirect = { type: 'current', url: '' }) {
    const redirectUrl = redirect.type === 'current' ? window.location.href : redirect.url;
    router.push({
      name: RouteNameMap.get('login'),
      params: { module },
      query: { redirectUrl }
    });
  }

  return {
    toHome,
    toLogin
  };
}
