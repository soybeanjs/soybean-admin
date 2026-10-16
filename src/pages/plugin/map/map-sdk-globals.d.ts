/** 注意：这些名字必须写在 `declare global` **里面**。文件末尾有 `export {}`， 详见 docs/v3-notes.md N-364。 */

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
