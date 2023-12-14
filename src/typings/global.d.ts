interface Window {
  /** NProgress instance */
  NProgress?: import('nprogress').NProgress;
  /** Loading bar instance */
  $loadingBar?: import('naive-ui').LoadingBarProviderInst;
  /** Dialog instance */
  $dialog?: import('naive-ui').DialogProviderInst;
  /** Message instance */
  $message?: import('naive-ui').MessageProviderInst;
  /** Notification instance */
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

/** Build time of the project */
declare const BUILD_TIME: string;
