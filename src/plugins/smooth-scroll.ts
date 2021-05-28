import smoothscroll from 'smoothscroll-polyfill';

/** 平滑滚动插件(兼容主流浏览器) */
export default function setupSmoothScroll() {
  smoothscroll.polyfill();
}
