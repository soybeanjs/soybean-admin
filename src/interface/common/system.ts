import type { MenuOption } from 'naive-ui';
import { EnumLoginModule } from '@/enum';

/** 菜单项配置 */
export type GlobalMenuOption = MenuOption & {
  routeName: string;
  routePath: string;
};

/** 登录模块 */
export type LoginModuleType = keyof typeof EnumLoginModule;

/** npm依赖包版本信息 */
export interface VersionInfo {
  name: string;
  version: string;
}
