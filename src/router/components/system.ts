import { RouteNameMap, setCacheName } from '../helpers';
import Login from '@/views/system/login/index.vue';
import NoPermission from '@/views/system/exception/403.vue';
import NotFound from '@/views/system/exception/404.vue';
import ServiceError from '@/views/system/exception/500.vue';

setCacheName(Login, RouteNameMap.get('login'));
setCacheName(NoPermission, RouteNameMap.get('no-permission'));
setCacheName(NotFound, RouteNameMap.get('not-found'));
setCacheName(ServiceError, RouteNameMap.get('service-error'));

export { Login, NoPermission, NotFound, ServiceError };
