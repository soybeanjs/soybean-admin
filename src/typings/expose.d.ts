/** vue 的defineExpose导出的类型 */
declare namespace Expose {
  interface BetterScroll {
    instance: import('@better-scroll/core').BScrollInstance;
  }

  interface ImageVerify {
    /** 获取图片验证码 */
    getImgCode(): void;
  }
}
