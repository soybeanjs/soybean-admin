/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue';

  const component: DefineComponent<object, object, any>;
  export default component;
}

/** env环境类型 */
type EnvType = 'dev' | 'test' | 'prod';

interface ImportMetaEnv {
  /** 项目基本地址 */
  readonly VITE_BASE_URL: string;
  /** 项目名称 */
  readonly VITE_APP_NAME: string;
  /** 项目标题 */
  readonly VITE_APP_TITLE: string;
  /** 项目描述 */
  readonly VITE_APP_DESC: string;
  /** 开发启动的服务端口号 */
  readonly VITE_SERVER_PORT: string;
  /** vite环境类型 */
  readonly VITE_ENV_TYPE?: EnvType;
  /** 开启请求代理 */
  readonly VITE_HTTP_PROXY?: 'true' | 'false';
  /** 是否开启打包文件大小结果分析 */
  readonly VITE_VISUALIZER?: 'true' | 'false';
  /** hash路由模式 */
  readonly VITE_HASH_ROUTE?: 'true' | 'false';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
