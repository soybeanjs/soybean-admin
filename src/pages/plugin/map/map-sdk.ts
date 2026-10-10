/**
 * 地图演示用的 JS SDK 直连地址（P4-01）。
 *
 * v2 把这些放在 `src/constants/map-sdk.ts`，但只有 plugin 地图页用得到 —— 放在
 * 插件模块内，避免 `src/constants/**` 被 plugin 的第三方细节污染。
 *
 * ⚠️ 这里的 key 是沿用 v2 的公开 demo key，仅够演示页用；真实项目请换自己的 key
 * 并改用环境变量注入。
 */

export const BAIDU_MAP_SDK_URL = `https://api.map.baidu.com/getscript?v=3.0&ak=KSezYymXPth1DIGILRX3oYN9PxbOQQmU&services=&t=20210201100830&s=1`;
export const AMAP_SDK_URL = 'https://webapi.amap.com/maps?v=2.0&key=e7bd02bd504062087e6563daf4d6721d';
export const TENCENT_MAP_SDK_URL = 'https://map.qq.com/api/gljs?v=1.exp&key=A6DBZ-KXPLW-JKSRY-ONZF4-CPHY3-K6BL7';
