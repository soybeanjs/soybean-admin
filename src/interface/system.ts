import type { MenuOption, DropdownOption } from 'naive-ui';

/** 菜单项配置 */
export type GlobalMenuOption = MenuOption & {
  routeName: string;
  routePath: string;
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
