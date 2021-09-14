import { h } from 'vue';
import type { Component } from 'vue';
import { NIcon } from 'naive-ui';

/** 动态渲染vicon */
export function dynamicIconRender(icon: Component) {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    });
  };
}
