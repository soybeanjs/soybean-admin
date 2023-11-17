import localforage from 'localforage';

/**
 * the storage type
 */
export type StorageType = 'local' | 'session';

export function createStorage<T extends object>(type: StorageType) {
  const stg = type === 'session' ? window.sessionStorage : window.localStorage;

  const storage = {
    /**
     * set session
     * @param key session key
     * @param value session value
     */
    set<K extends keyof T>(key: K, value: T[K]) {
      const json = JSON.stringify(value);

      stg.setItem(key as string, json);
    },
    /**
     * get session
     * @param key session key
     */
    get<K extends keyof T>(key: K): T[K] | null {
      const json = stg.getItem(key as string);
      if (json) {
        let storageData: T[K] | null = null;

        try {
          storageData = JSON.parse(json);
        } catch {}

        if (storageData) {
          return storageData as T[K];
        }
      }

      stg.removeItem(key as string);

      return null;
    },
    remove(key: keyof T) {
      stg.removeItem(key as string);
    },
    clear() {
      stg.clear();
    }
  };
  return storage;
}

type LocalForage<T extends object> = Omit<typeof localforage, 'getItem' | 'setItem' | 'removeItem'> & {
  getItem<K extends keyof T>(key: K, callback?: (err: any, value: T[K] | null) => void): Promise<T[K] | null>;

  setItem<K extends keyof T>(key: K, value: T[K], callback?: (err: any, value: T[K]) => void): Promise<T[K]>;

  removeItem(key: keyof T, callback?: (err: any) => void): Promise<void>;
};

type LocalforageDriver = 'local' | 'indexedDB' | 'webSQL';

export function createLocalforage<T extends object>(driver: LocalforageDriver) {
  const driverMap: Record<LocalforageDriver, string> = {
    local: localforage.LOCALSTORAGE,
    indexedDB: localforage.INDEXEDDB,
    webSQL: localforage.WEBSQL
  };

  localforage.config({
    driver: driverMap[driver]
  });

  return localforage as LocalForage<T>;
}
