/** 网址导航 */
export interface Website {
  /** 网址名称 */
  title: string;
  /** 网址简称 */
  abbr: string;
  /** 网址图标(网络地址，形状为正方形) */
  logo: string;
  /** 描述 */
  desc: string;
}

/** 网址导航 分类 */
export interface WebsiteCategory {
  /** 分类名称 */
  title: string;
  children: WebsiteCategory[] | Website[];
}
