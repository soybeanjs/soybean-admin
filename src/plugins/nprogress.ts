import NProgress from 'nprogress';

/** Setup plugin NProgress */
export function setupNProgress() {
  NProgress.configure({ easing: 'ease', speed: 500 });

  // mount on window
  window.NProgress = NProgress;
}
