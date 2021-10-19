import { RouteNameMap, setCacheName } from '../helpers';
import Exception403 from '@/views/system/exception/403.vue';
import Exception404 from '@/views/system/exception/404.vue';
import Exception500 from '@/views/system/exception/500.vue';

setCacheName(Exception404, RouteNameMap.get('exception_404'));
setCacheName(Exception403, RouteNameMap.get('exception_403'));
setCacheName(Exception500, RouteNameMap.get('exception_500'));

export { Exception403, Exception404, Exception500 };
