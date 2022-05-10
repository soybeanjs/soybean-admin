import { toRaw } from 'vue';
import { PiniaCustomProperties, PiniaCustomStateProperties, PiniaPluginContext } from 'pinia';
import { getLocal, setLocal } from '@/utils/storage';

type Options = {
  key: string;
  needKeepIds?: string[];
};

const keepStorage = (options: Options) => {
  const { key, needKeepIds = [] } = options;
  return (context: PiniaPluginContext): Partial<PiniaCustomProperties & PiniaCustomStateProperties> => {
    const { store } = context;
    const data = getLocal(`${key ?? 'pinia'}-${store.$id}`) as Object;
    if (needKeepIds.length === 0) {
      store.$subscribe(() => {
        setLocal(`${key ?? 'pinia'}-${store.$id}`, toRaw(store.$state));
      });
    } else if (needKeepIds.includes(store.$id)) {
      store.$subscribe(() => {
        setLocal(`${key ?? 'pinia'}-${store.$id}`, toRaw(store.$state));
      });
    }

    return { ...data };
  };
};

export default keepStorage;
