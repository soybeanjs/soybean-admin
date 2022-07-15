/**
 *后台服务的环境类型
 * - dev: 后台开发环境
 * - test: 后台测试环境
 * - prod: 后台生产环境
 */
type ServiceEnvType = 'dev' | 'test' | 'prod';

/** 后台服务的环境配置 */
interface ServiceEnvConfig {
  /** 请求地址 */
  url: string;
  /** 代理标识, 用于拦截地址转发代理(和后端请求路径中有无该路径没有关系) */
  proxy: '/proxy-flag';
}

interface ImportMetaEnv {
  /** 项目基本地址 */
  readonly VITE_BASE_URL: string;
  /** 项目名称 */
  readonly VITE_APP_NAME: string;
  /** 项目标题 */
  readonly VITE_APP_TITLE: string;
  /** 项目描述 */
  readonly VITE_APP_DESC: string;
  /**
   * 权限路由模式:
   * - static - 前端声明的静态
   * - dynamic - 后端返回的动态
   */
  readonly VITE_AUTH_ROUTE_MODE: 'static' | 'dynamic';
  /** 路由首页的路径 */
  readonly VITE_ROUTE_HOME_PATH: Exclude<AuthRoute.RoutePath, '/' | '/not-found-page' | '/:pathMatch(.*)*'>;
  /** vite环境类型 */
  readonly VITE_ENV_TYPE?: ServiceEnvType;
  /** 开启请求代理 */
  readonly VITE_HTTP_PROXY?: 'Y' | 'N';
  /** 是否开启打包文件大小结果分析 */
  readonly VITE_VISUALIZER?: 'Y' | 'N';
  /** 是否开启打包压缩 */
  readonly VITE_COMPRESS?: 'Y' | 'N';
  /** 压缩算法类型 */
  readonly VITE_COMPRESS_TYPE?: 'gzip' | 'brotliCompress' | 'deflate' | 'deflateRaw';
  /** hash路由模式 */
  readonly VITE_HASH_ROUTE?: 'Y' | 'N';
  /** 是否是部署的vercel */
  readonly VITE_VERCEL?: 'Y' | 'N';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
