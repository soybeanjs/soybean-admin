<script lang="ts" setup>
import { useThemeStore } from '@/store/modules/theme';
import { $t } from '@/locales';
import { computed } from 'vue';
import { Icon } from '@iconify/vue'
defineOptions({ name: 'SearchHistory' });

interface Props {
  options: App.Global.SearchHistoryOrCollect[];
}

const HISTORY_TYPE = "history";
const COLLECT_TYPE = "collect";

const props =  defineProps<Props>();

interface Emits {
  (e: "collect", val: App.Global.SearchHistoryOrCollect): void;
  (e: 'enter'): void;
  (e: 'delete', val: App.Global.SearchHistoryOrCollect): void;
}

const emit = defineEmits<Emits>();

const theme = useThemeStore();

const active = defineModel<string>('path', { required: true });

async function handleMouseEnter(item: App.Global.SearchHistoryOrCollect) {
  active.value = item.routePath;
}

const titleStyle = computed(() => {
  return {
    color: theme.themeColor,
    fontWeight: 500,
  }
});

const historyList = computed (() => {
 return props.options.filter(item => item.type === HISTORY_TYPE)
});

const collectList = computed(() => {
  return props.options.filter(item => item.type === COLLECT_TYPE)
});

function handleTo() {
  emit('enter');
}

function handleDelete(item: App.Global.SearchHistoryOrCollect) {
  emit('delete', item);
}

function handleCollect(item: App.Global.SearchHistoryOrCollect) {
  emit('collect', item);
}

</script>

<template>
  <NScrollbar>
    <div class="pb-12px">
      <template v-if="historyList.length">
        <div :style="titleStyle">{{ $t('common.search_history') }}</div>
        <div  v-for="item in historyList" :key="item.routePath">
          <div
          class="mt-8px h-56px flex-y-center cursor-pointer justify-between rounded-4px bg-#e5e7eb px-14px dark:bg-dark"
          :style="{
            background: item.routePath === active ? theme.themeColor : '',
            color: item.routePath === active ? '#fff' : ''
          }"
          @click="handleTo"
          @mouseenter="handleMouseEnter(item)"
        >
          <component :is="item.icon" />
          <span class="ml-5px flex-1">
            {{ (item.i18nKey && $t(item.i18nKey)) || item.label }}
          </span>
          <button class="w-24px h-24px action-button" @click="handleCollect(item)">
           <Icon class="w-20px h-20px icon" icon="soybean:star" />
          </button>
          <button class="w-24px h-24px action-button" @click="handleDelete(item)">
            <icon-ion-close  class="w-20px h-20px"></icon-ion-close>
          </button>
        </div>
        </div>
      </template>
      <template v-if="collectList.length">
        <div :style="titleStyle">{{ $t('common.collection_record') }}</div>
        <div  v-for="item in collectList" :key="item.routePath">
          <div
          class="mt-8px h-56px flex-y-center cursor-pointer justify-between rounded-4px bg-#e5e7eb px-14px dark:bg-dark"
          :style="{
            background: item.routePath === active ? theme.themeColor : '',
            color: item.routePath === active ? '#fff' : ''
          }"
          @click="handleTo"
          @mouseenter="handleMouseEnter(item)"
        >
          <Icon class="w-20px h-20px" icon="soybean:star" />
          <component :is="item.icon" />
          <span class="ml-5px flex-1">
            {{ (item.i18nKey && $t(item.i18nKey)) || item.label }}
          </span>
          <button class="w-24px h-24px action-button" @click="handleDelete(item)">
            <icon-ion-close  class="w-20px h-20px"></icon-ion-close>
          </button>
        </div>
        </div>
      </template>
    </div>
  </NScrollbar>
</template>

<style lang="scss" scoped>
.action-button {
  display: flex;
  justify-content: center;
  align-items: center;
  appearance: none;
  background: none;
  border: 0;
  line-height: 20px;
  border-radius: 50%;
  padding: 2px;
}
.action-button:hover {
  background-color: #0003;
  transition: background-color .1s ease-in;
  color:#fff;
  ::v-deep .icon path {
      fill:currentColor;
      stroke: currentColor;
      fill-rule: evenodd;
      stroke-linecap: round;
      transition: fill 0.3s ease-in;
    }
}


</style>
