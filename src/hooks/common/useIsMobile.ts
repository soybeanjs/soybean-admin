import { useBreakpoints, breakpointsTailwind } from '@vueuse/core';

/** 是否是移动端 */
export default function useIsMobile() {
  const breakpoints = useBreakpoints(breakpointsTailwind);
  const isMobile = breakpoints.smaller('lg');

  return {
    isMobile
  };
}
