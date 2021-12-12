interface ImportMetaEnv {
  /** 项目基本地址 */
  VITE_BASE_URL: string;
  /** 项目名称 */
  VITE_APP_NAME: string;
  /** 项目标题 */
  VITE_APP_TITLE: string;
  /** 项目描述 */
  VITE_APP_DESC: string;
  /** 网路请求环境类型 */
  VITE_HTTP_ENV: 'DEV' | 'PROD' | 'STAGING';
  /** 网路请求地址 */
  VITE_HTTP_URL: string;
}
