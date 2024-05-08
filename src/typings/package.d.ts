/// <reference types="@amap/amap-jsapi-types" />
/// <reference types="bmapgl" />

declare namespace BMap {
  class Map extends BMapGL.Map {}
  class Point extends BMapGL.Point {}
}

declare const TMap: any;

interface Window {
  /**
   * make baidu map request under https protocol
   *
   * - 0: http
   * - 1: https
   * - 2: https
   */
  HOST_TYPE: '0' | '1' | '2';
}
