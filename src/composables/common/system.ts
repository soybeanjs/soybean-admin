import { useBreakpoints, breakpointsTailwind } from '@vueuse/core';

interface AppInfo {
  /** 项目名称 */
  name: string;
  /** 项目标题 */
  title: string;
  /** 项目描述 */
  desc: string;
}

/** 项目信息 */
export function useAppInfo(): AppInfo {
  const { VITE_APP_NAME: name, VITE_APP_TITLE: title, VITE_APP_DESC: desc } = import.meta.env;

  return {
    name,
    title,
    desc
  };
}

/** 是否是移动端 */
export function useIsMobile() {
  const breakpoints = useBreakpoints(breakpointsTailwind);
  const isMobile = breakpoints.smaller('lg');
  return isMobile;
}
