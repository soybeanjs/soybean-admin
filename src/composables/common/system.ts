import { useBreakpoints, breakpointsTailwind } from '@vueuse/core';

/** 项目名称 */
export function useAppTitle() {
  return import.meta.env.VITE_APP_TITLE as string;
}

/** 是否是移动端 */
export function useIsMobile() {
  const breakpoints = useBreakpoints(breakpointsTailwind);
  const isMobile = breakpoints.smaller('lg');
  return isMobile;
}
