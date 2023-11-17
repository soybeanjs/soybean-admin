interface Window {
  /**
   * NProgress instance
   */
  NProgress?: import('nprogress').NProgress;
  /**
   * loading bar instance
   */
  $loadingBar?: import('naive-ui').LoadingBarProviderInst;
  /**
   * dialog instance
   */
  $dialog?: import('naive-ui').DialogProviderInst;
  /**
   * message instance
   */
  $message?: import('naive-ui').MessageProviderInst;
  /**
   * notification instance
   */
  $notification?: import('naive-ui').NotificationProviderInst;
}

interface ViewTransition {
  ready: Promise<void>;
}

interface Document {
  startViewTransition?: (callback: () => Promise<void> | void) => ViewTransition;
}

interface ImportMeta {
  readonly env: Env.ImportMeta;
}

/**
 * build time of the project
 */
declare const BUILD_TIME: string;
