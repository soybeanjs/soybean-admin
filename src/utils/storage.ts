import { createLocalforage, createStorage } from '@sa/utils';

export const localStg = createStorage<StorageType.Local>('local');

export const sessionStg = createStorage<StorageType.Session>('session');

export const localforage = createLocalforage<StorageType.Local>('local');
