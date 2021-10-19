import { RouteNameMap, setCacheName } from '../helpers';
import About from '@/views/about/index.vue';

setCacheName(About, RouteNameMap.get('about'));

export { About };
