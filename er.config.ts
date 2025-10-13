import type { RouteMeta } from 'vue-router';
import { defineConfig } from 'elegant-router';
import type { RouteKey } from '@elegant-router/types';

export default defineConfig({
  pageDir: ['src/views'],
  layouts: {
    base: 'src/layouts/base-layout/index.vue',
    blank: 'src/layouts/blank-layout/index.vue'
  },
  getRoutePath: node => {
    if (node.name === 'Login') {
      const modules: UnionKey.LoginModule[] = ['pwd-login', 'code-login', 'register', 'reset-pwd', 'bind-wechat'];

      const moduleReg = modules.join('|');

      return `/login/:module(${moduleReg})?`;
    }

    return node.path;
  },
  getRouteMeta: node => {
    const constantRoutes: RouteKey[] = ['Login', '403', '404', '500'];

    const name = node.name as RouteKey;

    const meta: Partial<RouteMeta> = {
      title: name
    };

    if (constantRoutes.includes(name)) {
      meta.constant = true;
    }

    return meta;
  }
});
