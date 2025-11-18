import { ref } from 'vue';
import { defineStore } from 'pinia';
import { $t } from '@/locales';
import { SetupStoreId } from '@/enum';

export const useDictStore = defineStore(SetupStoreId.Dict, () => {
  const dictData = ref<{ [key: string]: Api.System.DictData[] }>({});

  const getDict = (key: string) => {
    return dictData.value[key]?.map(item => ({
      ...item,
      dictLabel: item.dictLabel?.startsWith(`dict.${item.dictType}.`)
        ? $t(item.dictLabel as App.I18n.I18nKey)
        : item.dictLabel
    }));
  };

  const setDict = (key: string, dict: Api.System.DictData[]) => {
    dictData.value[key] = dict;
  };

  const removeDict = (key: string) => {
    if (key in dictData.value) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete dictData.value[key];
    }
  };

  const cleanDict = () => {
    dictData.value = {};
  };

  return {
    dictData,
    getDict,
    setDict,
    removeDict,
    cleanDict
  };
});

export default useDictStore;
