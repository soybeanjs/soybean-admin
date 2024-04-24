import { createLocalforage, createStorage } from '@sa/utils';

const StoragePrefix = import.meta.env.VITE_STORAGE_PREFIX || '';

export const localStg = createStorage<StorageType.Local>('local', StoragePrefix);

export const sessionStg = createStorage<StorageType.Session>('session', StoragePrefix);

export const localforage = createLocalforage<StorageType.Local>('local');
