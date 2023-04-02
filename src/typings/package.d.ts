/// <reference types="@amap/amap-jsapi-types" />
/// <reference types="bmapgl" />

declare namespace BMap {
  class Map extends BMapGL.Map {}
  class Point extends BMapGL.Point {}
}

declare const TMap: any;

declare module 'unplugin-vue-define-options/vite' {
  const plugin: (options?: import('unplugin-vue-define-options/dist/unplugin.d-59ddef99').B) => import('vite').Plugin;

  export default plugin;
}
