/**
 * 地图 SDK 的全局类型声明（P4-01）。
 *
 * 三个 SDK 都是通过 `<script>` 注入的 UMD 包，挂在全局作用域上、**没有 npm
 * 类型包**。这里只声明地图页真正用到的构造器与方法，够用就好；不要让
 * `@types/*` 这类依赖为了三个演示页进入依赖树。
 *
 * 注意：这些名字必须写在 `declare global` **里面**。文件末尾有 `export {}`，
 * 所以文件本身是模块；写在模块作用域的 `declare const` 只是模块局部变量，
 * 组件里看不到。
 */

declare global {
  interface Window {
    /** 百度地图要求的宿主标识（`'2'` 走 GL 分支） */
    HOST_TYPE?: string;
  }

  /** 高德地图 2.0：`new AMap.Map(el, options)` */
  const AMap: {
    Map: new (
      container: HTMLElement,
      options?: { zoom?: number; center?: [number, number]; viewMode?: string }
    ) => {
      getCenter: () => unknown;
    };
  };

  /** 腾讯地图 GL JS：`new TMap.Map(el, options)`、`new TMap.LatLng(lat, lng)` */
  const TMap: {
    LatLng: new (lat: number, lng: number) => unknown;
    Map: new (container: HTMLElement, options?: { center?: unknown; zoom?: number; viewMode?: string }) => unknown;
  };

  /** 百度地图：`new BMap.Map(el)`、`new BMap.Point(lng, lat)` */
  const BMap: {
    Point: new (lng: number, lat: number) => unknown;
    Map: new (container: HTMLElement) => {
      centerAndZoom: (point: unknown, zoom: number) => void;
      enableScrollWheelZoom: () => void;
    };
  };
}

export {};
