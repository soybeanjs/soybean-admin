import { handleModuleRoutes } from '@/utils/router/module';
import about from './about';
import authDemo from './auth-demo';
import component from './component';
import dashboard from './dashboard';
import document from './document';
import exception from './exception';
import func from './function';
import management from './management';
import multiMenu from './multi-menu';
import plugin from './plugin';

// const modules = import.meta.glob('./**/*.ts', { eager: true }) as AuthRoute.RouteModule;
const modules = {
  '/about': { default: about },
  '/auth-demo': { default: authDemo },
  '/component': { default: component },
  '/dashboard': { default: dashboard },
  '/document': { default: document },
  '/exception': { default: exception },
  '/func': { default: func },
  '/management': { default: management },
  '/multi-menu': { default: multiMenu },
  '/plugin': { default: plugin }
} as AuthRoute.RouteModule;
export const routes = handleModuleRoutes(modules);
