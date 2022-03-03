/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue';

  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMetaEnv {
  /** 项目基本地址 */
  readonly VITE_APP_BASE_URL: string;
  /** 项目名称 */
  readonly VITE_APP_NAME: string;
  /** 项目标题 */
  readonly VITE_APP_TITLE: string;
  /** 项目描述 */
  readonly VITE_APP_DESC: string;
  /** 网路请求环境类型 */
  readonly VITE_HTTP_ENV: Service.HttpEnv;
  /** 是否是部署vercel */
  readonly VITE_IS_VERCEL?: '1';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
