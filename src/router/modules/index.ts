import { handleModuleRoutes } from '@/utils';

const modules = import.meta.globEager('./**/*.ts') as AuthRoute.RouteModule;

export const routes = handleModuleRoutes(modules);
