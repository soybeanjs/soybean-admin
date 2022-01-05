const Login = () => import('./login/index.vue');
const NoPermission = () => import('./exception/no-permission/index.vue');
const NotFound = () => import('./exception/not-found/index.vue');
const ServiceError = () => import('./exception/service-error/index.vue');

export { Login, NoPermission, NotFound, ServiceError };
