<script lang="ts" setup>
import { computed, ref, shallowRef,watch } from 'vue';
import { match } from "pinyin-pro";
import { useRouter } from 'vue-router';
import { onKeyStroke, useDebounceFn } from '@vueuse/core';
import { useRouteStore } from '@/store/modules/route';
import { useAppStore } from '@/store/modules/app';
import { $t } from '@/locales';
import SearchResult from './search-result.vue';
import SearchFooter from './search-footer.vue';
import SearchHistory from './search-history.vue';
import { useI18n } from 'vue-i18n';
import { localStg } from '@/utils/storage';
import { themeSettings } from '@/theme/settings';

defineOptions({ name: 'SearchModal' });
const SOYBEAN_LOCAL_STG_HISTORY_KEY = 'searchHistory'
const SOYBEAN_LOCAL_STG_COLLECT_KEY = 'searchCollect'
const HISTORY_TYPE = "history";
const COLLECT_TYPE = "collect";
const router = useRouter();
const appStore = useAppStore();
const routeStore = useRouteStore();

const isMobile = computed(() => appStore.isMobile);

const keyword = ref('');
const activePath = ref('');
const historyPath = ref("");
const resultOptions = shallowRef<App.Global.Menu[]>([]);
const historyOptions = shallowRef<App.Global.SearchHistoryOrCollect[]>([]);
const { locale } = useI18n()
const handleSearch = useDebounceFn(search, 300);

const visible = defineModel<boolean>('show', { required: true });

const isShowSearchResult = computed(() => {
  return keyword.value || historyOptions.value.length > 0;
});

const isShowSearchHistory = computed(() => {
  return !keyword.value && historyOptions.value.length > 0;
});

const showEmpty = computed(() => {
  return (
    (!keyword.value && historyOptions.value.length === 0) ||
    (keyword.value && resultOptions.value.length === 0)
  );
});


function search() {
  resultOptions.value = routeStore.searchMenus.filter(menu => {
    const trimKeyword = keyword.value.toLocaleLowerCase().trim();
    const title = (menu.i18nKey ? $t(menu.i18nKey) : menu.label).toLocaleLowerCase();
    const pinyinPro = locale.value === 'zh-CN' &&  match(title, keyword.value.toLocaleLowerCase().trim())?.every(arg => arg !== null)
    const result = keyword.value ? (title.includes(trimKeyword) || pinyinPro) : false
    return result;
  });
  activePath.value = resultOptions.value[0]?.routePath ?? '';
}

watch(visible, () => {
  getHistory()
})

/** get current options */
function getCuurentOptionsPath() {
  const isResultOptions  = resultOptions.value.length > 0;
  const options = isResultOptions? resultOptions.value : historyOptions.value
  const currentPath = isResultOptions ? activePath.value : historyPath.value
  return {isResultOptions,options,currentPath}
}

/** get localStg history */
function getHistory() {
  const searchHistoryMenus = localStg.get(SOYBEAN_LOCAL_STG_HISTORY_KEY) || []
  const searchCollectMenus = localStg.get(SOYBEAN_LOCAL_STG_COLLECT_KEY) || []
  historyOptions.value = [...searchHistoryMenus,...searchCollectMenus]
  historyPath.value = historyOptions.value?.[0]?.routePath
}

/** update localStg history */
function updateHistory() {
  let searchHistoryMenus = localStg.get(SOYBEAN_LOCAL_STG_HISTORY_KEY) || [];
  const historyIndex = searchHistoryMenus.findIndex(item => item.routePath === historyPath.value)
  if (!~historyIndex) {
    const [historyItem] = searchHistoryMenus.splice(historyIndex,1)
    searchHistoryMenus.unshift(historyItem)
    localStg.set(SOYBEAN_LOCAL_STG_HISTORY_KEY, searchHistoryMenus)
  }
}

/** save history */
function saveHistory() {
  const res =  resultOptions.value.find(item => item.routePath === activePath.value)
  const searchHistoryMenus = localStg.get(SOYBEAN_LOCAL_STG_HISTORY_KEY) || []
  const searchCollectMenus = localStg.get(SOYBEAN_LOCAL_STG_COLLECT_KEY) || []
  const isCollected = searchCollectMenus.some(item => item.routePath === res?.routePath)
  const existingIndex = searchHistoryMenus.findIndex(item => item.routePath === res?.routePath);
  if(!isCollected && res) {
    if(existingIndex !== -1) {
      searchHistoryMenus.splice(existingIndex,1)
    }
    if(searchHistoryMenus.length < themeSettings.menuSearchHistoryMaxValue) {
      searchHistoryMenus.unshift({...res, type: HISTORY_TYPE});
    } else {
      searchHistoryMenus.pop()
    }
    localStg.set(SOYBEAN_LOCAL_STG_HISTORY_KEY, searchHistoryMenus)
  }
}

/** handle delete */
function handleDelete(options: App.Global.SearchHistoryOrCollect) {
  let searchHistoryMenus = localStg.get(SOYBEAN_LOCAL_STG_HISTORY_KEY) || []
  let searchCollectMenus = localStg.get(SOYBEAN_LOCAL_STG_COLLECT_KEY) || []
  if(options.type === HISTORY_TYPE) {
    searchHistoryMenus = searchHistoryMenus.filter(item => item.routePath !== options.routePath)
    localStg.set(SOYBEAN_LOCAL_STG_HISTORY_KEY,searchHistoryMenus)
  } else {
    searchCollectMenus = searchCollectMenus.filter(item => item.routePath !== options.routePath)
    localStg.set(SOYBEAN_LOCAL_STG_COLLECT_KEY,searchCollectMenus)
  }
  getHistory()
}

/** handle collect */
function handleCollect(options: App.Global.SearchHistoryOrCollect) {
  let searchHistoryMenus = localStg.get(SOYBEAN_LOCAL_STG_HISTORY_KEY) || []
  let searchCollectMenus = localStg.get(SOYBEAN_LOCAL_STG_COLLECT_KEY) || []
  searchHistoryMenus = searchHistoryMenus.filter(item => item.routePath !== options.routePath)
  localStg.set(SOYBEAN_LOCAL_STG_COLLECT_KEY,searchHistoryMenus)
  const isCollected = searchCollectMenus.some(item => item.routePath === options.routePath)
  if(!isCollected) {
    searchCollectMenus.unshift({...options, type: COLLECT_TYPE});
    localStg.set(SOYBEAN_LOCAL_STG_COLLECT_KEY,searchCollectMenus)
  }
  getHistory()
}

function handleClose() {
  // handle with setTimeout to prevent user from seeing some operations
  setTimeout(() => {
    visible.value = false;
    resultOptions.value = [];
    keyword.value = '';
  }, 200);
}

/** key up */
function handleUp() {
  const { isResultOptions,options,currentPath } = getCuurentOptionsPath()
  if (options.length === 0) return;
  const index = options.findIndex(item => item.routePath === currentPath);
  const prevIndex = (index - 1 + options.length) % options.length;
  if (isResultOptions) {
    activePath.value = resultOptions.value[prevIndex].routePath;
  } else {
    historyPath.value = historyOptions.value[prevIndex].routePath;
  }
}

/** key down */
function handleDown() {
  const { isResultOptions,options,currentPath } = getCuurentOptionsPath()
  if (options.length === 0) return;
  const index = options.findIndex(item => item.routePath === currentPath);
  const prevIndex = (index + 1 + options.length) % options.length;
  if (isResultOptions) {
    activePath.value = resultOptions.value[prevIndex].routePath;
  } else {
    historyPath.value = historyOptions.value[prevIndex].routePath;
  }
}


/** key enter */
function handleEnter() {
  const { isResultOptions, options, currentPath } = getCuurentOptionsPath()
  if (options?.length === 0 || currentPath === '') return;
  const index = options.findIndex((item) =>  item.routePath === currentPath);
  if (index === -1) return;
  if (isResultOptions) {
    saveHistory();
  } else {
    updateHistory();
  }
  router.push(options[index].routePath);
  handleClose();
}

function registerShortcut() {
  onKeyStroke('Escape', handleClose);
  onKeyStroke('Enter', handleEnter);
  onKeyStroke('ArrowUp', handleUp);
  onKeyStroke('ArrowDown', handleDown);
}

registerShortcut();

</script>

<template>
  <NModal
    v-model:show="visible"
    :segmented="{ footer: 'soft' }"
    :closable="false"
    preset="card"
    auto-focus
    footer-style="padding: 0; margin: 0"
    class="fixed left-0 right-0"
    :class="[isMobile ? 'size-full top-0px rounded-0' : 'w-630px top-50px']"
    @after-leave="handleClose"
  >
    <NInputGroup>
      <NInput v-model:value="keyword" :spellcheck="false" clearable :placeholder="$t('common.keywordSearch')" @input="handleSearch">
        <template #prefix>
          <icon-uil-search class="text-15px text-#c2c2c2" />
        </template>
      </NInput>
      <NButton v-if="isMobile" type="primary" ghost @click="handleClose">{{ $t('common.cancel') }}</NButton>
    </NInputGroup>

    <div class="mt-20px">
      <NEmpty v-if="showEmpty" :description="$t('common.noData')" />
      <SearchHistory v-if="isShowSearchHistory" v-model:path="historyPath" :options="historyOptions" @enter="handleEnter" @collect="handleCollect" @delete="handleDelete" />
      <SearchResult v-if="isShowSearchResult" v-model:path="activePath" :options="resultOptions" @enter="handleEnter" />
    </div>
    <template #footer>
      <SearchFooter v-if="!isMobile" />
    </template>
  </NModal>
</template>

<style lang="scss" scoped></style>
