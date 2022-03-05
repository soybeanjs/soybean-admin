import type { Component } from 'vue';

type ViewComponent = Record<string, () => Promise<Component>>;

const importViews = import.meta.glob('./**/index.vue');

const COMPONENTS_KEY = 'components';

/**
 * 路径正则匹配
 * 1 './' => ''
 * 2 '/index.vue' => ''
 * 3 'system-view_' => '' (系统的内置路由，该文件夹名称不作为RouteKey)
 */
const KEY_REGEXP = /\.\/|\/index\.vue|system-view_/g;

const PATH_SPLIT_MARK = '/';
const ROUTE_KEY_SPLIT_MARK = '_';

/** 过滤掉组件文件 */
const viewKeys = Object.keys(importViews).filter(key => !key.includes(COMPONENTS_KEY));

function getViewComponent() {
  const components: ViewComponent = {};
  viewKeys.forEach(key => {
    const routeKey = key.replace(KEY_REGEXP, '').replace(new RegExp(PATH_SPLIT_MARK, 'g'), ROUTE_KEY_SPLIT_MARK);

    components[routeKey] = importViews[key];
  });
  return components;
}

export const views = getViewComponent();
