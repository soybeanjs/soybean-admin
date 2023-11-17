import { h } from 'vue';
import type { Component } from 'vue';

/**
 * svg icon render hook
 * @param SvgIcon svg icon component
 */
export default function useSvgIconRender(SvgIcon: Component) {
  interface IconConfig {
    /**
     * iconify icon name
     */
    icon?: string;
    /**
     * local icon name
     */
    localIcon?: string;
    /**
     * icon color
     */
    color?: string;
    /**
     * icon size
     */
    fontSize?: number;
  }

  type IconStyle = Partial<Pick<CSSStyleDeclaration, 'color' | 'fontSize'>>;

  /**
   * svg icon VNode
   * @param config
   */
  const SvgIconVNode = (config: IconConfig) => {
    const { color, fontSize, icon, localIcon } = config;

    const style: IconStyle = {};

    if (color) {
      style.color = color;
    }
    if (fontSize) {
      style.fontSize = `${fontSize}px`;
    }

    if (!icon && !localIcon) {
      return undefined;
    }

    return () => h(SvgIcon, { icon, localIcon, style });
  };

  return {
    SvgIconVNode
  };
}
