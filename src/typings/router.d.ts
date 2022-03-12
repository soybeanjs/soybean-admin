import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta extends AuthRoute.RouteMeta {}
}
