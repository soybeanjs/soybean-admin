import type { App } from 'vue';
import setupNetworkDirective from './network';
import setupLoginDirective from './login';

export function setupDirectives(app: App) {
  setupNetworkDirective(app);
  setupLoginDirective(app);
}
