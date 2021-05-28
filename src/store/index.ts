import type { App } from 'vue';
import { createAuthStore, useAuthStore } from './modules/auth';
import { createAsideStore, useAsideStore } from './modules/aside';

export function createStore(app: App) {
  createAuthStore(app);
  createAsideStore(app);
}

export { useAuthStore, useAsideStore };
