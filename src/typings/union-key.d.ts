/** The union key namespace */
declare namespace UnionKey {
  /**
   * The login module
   *
   * - pwd-login: password login
   * - code-login: phone code login
   * - register: register
   * - reset-pwd: reset password
   * - bind-wechat: bind wechat
   */
  type LoginModule = 'pwd-login' | 'code-login' | 'register' | 'reset-pwd' | 'bind-wechat';

  /** Theme scheme */
  type ThemeScheme = 'light' | 'dark' | 'auto';

  /**
   * Reset cache strategy
   *
   * - close: re-cache when close page
   * - refresh: re-cache when refresh page
   */
  type ResetCacheStrategy = 'close' | 'refresh';

  /**
   * The layout mode
   *
   * - vertical: the vertical menu in left
   * - horizontal: the horizontal menu in top
   * - vertical-mix: two vertical mixed menus in left
   * - horizontal-mix: the vertical first level menus in left and horizontal child level menus in top
   */
  type ThemeLayoutMode = 'vertical' | 'horizontal' | 'vertical-mix' | 'horizontal-mix';

  /**
   * The scroll mode when content overflow
   *
   * - wrapper: the wrapper component's root element overflow
   * - content: the content component overflow
   */
  type ThemeScrollMode = import('@sa/materials').LayoutScrollMode;

  /** Page animate mode */
  type ThemePageAnimateMode = 'fade' | 'fade-slide' | 'fade-bottom' | 'fade-scale' | 'zoom-fade' | 'zoom-out' | 'none';

  /**
   * Tab mode
   *
   * - chrome: chrome style
   * - button: button style
   */
  type ThemeTabMode = import('@sa/materials').PageTabMode;

  /** Unocss animate key */
  type UnoCssAnimateKey =
    | 'pulse'
    | 'bounce'
    | 'spin'
    | 'ping'
    | 'bounce-alt'
    | 'flash'
    | 'pulse-alt'
    | 'rubber-band'
    | 'shake-x'
    | 'shake-y'
    | 'head-shake'
    | 'swing'
    | 'tada'
    | 'wobble'
    | 'jello'
    | 'heart-beat'
    | 'hinge'
    | 'jack-in-the-box'
    | 'light-speed-in-left'
    | 'light-speed-in-right'
    | 'light-speed-out-left'
    | 'light-speed-out-right'
    | 'flip'
    | 'flip-in-x'
    | 'flip-in-y'
    | 'flip-out-x'
    | 'flip-out-y'
    | 'rotate-in'
    | 'rotate-in-down-left'
    | 'rotate-in-down-right'
    | 'rotate-in-up-left'
    | 'rotate-in-up-right'
    | 'rotate-out'
    | 'rotate-out-down-left'
    | 'rotate-out-down-right'
    | 'rotate-out-up-left'
    | 'rotate-out-up-right'
    | 'roll-in'
    | 'roll-out'
    | 'zoom-in'
    | 'zoom-in-down'
    | 'zoom-in-left'
    | 'zoom-in-right'
    | 'zoom-in-up'
    | 'zoom-out'
    | 'zoom-out-down'
    | 'zoom-out-left'
    | 'zoom-out-right'
    | 'zoom-out-up'
    | 'bounce-in'
    | 'bounce-in-down'
    | 'bounce-in-left'
    | 'bounce-in-right'
    | 'bounce-in-up'
    | 'bounce-out'
    | 'bounce-out-down'
    | 'bounce-out-left'
    | 'bounce-out-right'
    | 'bounce-out-up'
    | 'slide-in-down'
    | 'slide-in-left'
    | 'slide-in-right'
    | 'slide-in-up'
    | 'slide-out-down'
    | 'slide-out-left'
    | 'slide-out-right'
    | 'slide-out-up'
    | 'fade-in'
    | 'fade-in-down'
    | 'fade-in-down-big'
    | 'fade-in-left'
    | 'fade-in-left-big'
    | 'fade-in-right'
    | 'fade-in-right-big'
    | 'fade-in-up'
    | 'fade-in-up-big'
    | 'fade-in-top-left'
    | 'fade-in-top-right'
    | 'fade-in-bottom-left'
    | 'fade-in-bottom-right'
    | 'fade-out'
    | 'fade-out-down'
    | 'fade-out-down-big'
    | 'fade-out-left'
    | 'fade-out-left-big'
    | 'fade-out-right'
    | 'fade-out-right-big'
    | 'fade-out-up'
    | 'fade-out-up-big'
    | 'fade-out-top-left'
    | 'fade-out-top-right'
    | 'fade-out-bottom-left'
    | 'fade-out-bottom-right'
    | 'back-in-up'
    | 'back-in-down'
    | 'back-in-right'
    | 'back-in-left'
    | 'back-out-up'
    | 'back-out-down'
    | 'back-out-right'
    | 'back-out-left';
}
