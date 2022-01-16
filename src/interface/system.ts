import type { VNodeChild } from 'vue';
import type { DropdownOption } from 'naive-ui';

/** 菜单项配置 */
export type GlobalMenuOption = {
  key: string;
  label: string;
  routeName: string;
  routePath: string;
  icon?: () => VNodeChild;
  children?: GlobalMenuOption[];
};

/** 面包屑 */
export type GlobalBreadcrumb = DropdownOption & {
  key: string;
  label: string;
  disabled: boolean;
  routeName: string;
  hasChildren: boolean;
  children?: GlobalBreadcrumb[];
};
