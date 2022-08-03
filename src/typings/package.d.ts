/// <reference types="vite/client" />
/// <reference types="@amap/amap-jsapi-types" />
/// <reference types="bmapgl" />

declare namespace BMap {
  class Map extends BMapGL.Map {}
  class Point extends BMapGL.Point {}
}

declare const TMap: any;

declare module 'virtual:icons/*' {
  import type { FunctionalComponent, SVGAttributes } from 'vue';

  const component: FunctionalComponent<SVGAttributes>;
  export default component;
}
declare module '~icons/*' {
  import type { FunctionalComponent, SVGAttributes } from 'vue';

  const component: FunctionalComponent<SVGAttributes>;
  export default component;
}
