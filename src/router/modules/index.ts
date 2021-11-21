import { transformRouteModules } from '@/utils';
import type { ImportedRouteModules } from '@/interface';

const modules = import.meta.globEager('./*.ts') as ImportedRouteModules;

const customRoutes = transformRouteModules(modules);

export default customRoutes;
