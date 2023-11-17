/**
 * header config
 */
interface AdminLayoutHeaderConfig {
  /**
   * whether header is visible
   * @default true
   */
  headerVisible?: boolean;
  /**
   * header class
   * @default ''
   */
  headerClass?: string;
  /**
   * header height
   * @default 56px
   */
  headerHeight?: number;
}

/**
 * tab config
 */
interface AdminLayoutTabConfig {
  /**
   * whether tab is visible
   * @default true
   */
  tabVisible?: boolean;
  /**
   * tab class
   * @default ''
   */
  tabClass?: string;
  /**
   * tab height
   * @default 48px
   */
  tabHeight?: number;
}

/**
 * sider config
 */
interface AdminLayoutSiderConfig {
  /**
   * whether sider is visible
   * @default true
   */
  siderVisible?: boolean;
  /**
   * sider class
   * @default ''
   */
  siderClass?: string;
  /**
   * mobile sider class
   * @default ''
   */
  mobileSiderClass?: string;
  /**
   * sider collapse status
   * @default false
   */
  siderCollapse?: boolean;
  /**
   * sider width when collapse is false
   * @default '220px'
   */
  siderWidth?: number;
  /**
   * sider width when collapse is true
   * @default '64px'
   */
  siderCollapsedWidth?: number;
}

/**
 * content config
 */
export interface AdminLayoutContentConfig {
  /**
   * content class
   * @default ''
   */
  contentClass?: string;
  /**
   * whether content is full the page
   * @description if true, other elements will be hidden by `display: none`
   */
  fullContent?: boolean;
}

/**
 * footer config
 */
export interface AdminLayoutFooterConfig {
  /**
   * whether footer is visible
   * @default true
   */
  footerVisible?: boolean;
  /**
   * whether footer is fixed
   * @default true
   */
  fixedFooter?: boolean;
  /**
   * footer class
   * @default ''
   */
  footerClass?: string;
  /**
   * footer height
   * @default 48px
   */
  footerHeight?: number;
  /**
   * whether footer is on the right side
   * @description when the layout is vertical, the footer is on the right side
   */
  rightFooter?: boolean;
}

/**
 * layout mode
 * - horizontal
 * - vertical
 */
export type LayoutMode = 'horizontal' | 'vertical';

/**
 * the scroll mode when content overflow
 * - wrapper: the layout component's wrapper element has a scrollbar
 * - content: the layout component's content element has a scrollbar
 * @default 'wrapper'
 */
export type LayoutScrollMode = 'wrapper' | 'content';

/**
 * admin layout props
 */
export interface AdminLayoutProps
  extends AdminLayoutHeaderConfig,
    AdminLayoutTabConfig,
    AdminLayoutSiderConfig,
    AdminLayoutContentConfig,
    AdminLayoutFooterConfig {
  /**
   * layout mode
   * - {@link LayoutMode}
   */
  mode?: LayoutMode;
  /** is mobile layout */
  isMobile?: boolean;
  /**
   * scroll mode
   * - {@link ScrollMode}
   */
  scrollMode?: LayoutScrollMode;
  /**
   * the id of the scroll element of the layout
   * @description it can be used to get the corresponding Dom and scroll it
   * @default
   * ```ts
   * const adminLayoutScrollElId = '__ADMIN_LAYOUT_SCROLL_EL_ID__'
   * ```
   * @example use the default id by import
   * ```ts
   * import { adminLayoutScrollElId } from '@sa/vue-materials';
   * ```
   */
  scrollElId?: string;
  /**
   * the class of the scroll element
   */
  scrollElClass?: string;
  /**
   * the class of the scroll wrapper element
   */
  scrollWrapperClass?: string;
  /**
   * the common class of the layout
   * @description is can be used to configure the transition animation
   * @default 'transition-all-300'
   */
  commonClass?: string;
  /**
   * whether fix the header and tab
   * @default true
   */
  fixedTop?: boolean;
  /**
   * the max z-index of the layout
   * @description the z-index of Header,Tab,Sider and Footer will not exceed this value
   */
  maxZIndex?: number;
}

type Kebab<S extends string> = S extends Uncapitalize<S> ? S : `-${Uncapitalize<S>}`;

type KebabCase<S extends string> = S extends `${infer Start}${infer End}`
  ? `${Uncapitalize<Start>}${KebabCase<Kebab<End>>}`
  : S;

type Prefix = '--soy-';

export type LayoutCssVarsProps = Pick<
  AdminLayoutProps,
  'headerHeight' | 'tabHeight' | 'siderWidth' | 'siderCollapsedWidth' | 'footerHeight'
> & {
  headerZIndex?: number;
  tabZIndex?: number;
  siderZIndex?: number;
  mobileSiderZIndex?: number;
  footerZIndex?: number;
};

export type LayoutCssVars = {
  [K in keyof LayoutCssVarsProps as `${Prefix}${KebabCase<K>}`]: string | number;
};

/**
 * the mode of the tab
 * - button: button style
 * - chrome: chrome style
 * @default chrome
 */
export type PageTabMode = 'button' | 'chrome';

export interface PageTabProps {
  /**
   * whether is dark mode
   */
  darkMode?: boolean;
  /**
   * the mode of the tab
   * - {@link TabMode}
   */
  mode?: PageTabMode;
  /**
   * the common class of the layout
   * @description is can be used to configure the transition animation
   * @default 'transition-all-300'
   */
  commonClass?: string;
  /**
   * the class of the button tab
   */
  buttonClass?: string;
  /**
   * the class of the chrome tab
   */
  chromeClass?: string;
  /**
   * whether the tab is active
   */
  active?: boolean;
  /**
   * the color of the active tab
   */
  activeColor?: string;
  /**
   * whether the tab is closable
   * @description show the close icon when true
   */
  closable?: boolean;
}

export type PageTabCssVarsProps = {
  primaryColor: string;
  primaryColor1: string;
  primaryColor2: string;
  primaryColorOpacity1: string;
  primaryColorOpacity2: string;
  primaryColorOpacity3: string;
};

export type PageTabCssVars = {
  [K in keyof PageTabCssVarsProps as `${Prefix}${KebabCase<K>}`]: string | number;
};
