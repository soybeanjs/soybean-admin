const Login = () => import('./login/index.vue');
const NoPermission = () => import('./exception/403.vue');
const NotFound = () => import('./exception/404.vue');
const ServiceError = () => import('./exception/500.vue');

export { Login, NoPermission, NotFound, ServiceError };
