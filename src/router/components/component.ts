import { RouteNameMap, setCacheName } from '../helpers';

import ComponentMap from '@/views/component/map/index.vue';
import ComponentVideo from '@/views/component/video/index.vue';

setCacheName(ComponentMap, RouteNameMap.get('component_map'));
setCacheName(ComponentVideo, RouteNameMap.get('component_video'));

export { ComponentMap, ComponentVideo };
