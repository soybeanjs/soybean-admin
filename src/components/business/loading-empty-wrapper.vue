<template>
  <div v-if="reloadFlag" class="relative">
    <slot></slot>
    <div v-show="showPlaceholder" class="absolute-lt w-full h-full" :class="placeholderClass">
      <div v-show="loading" class="absolute-center">
        <n-spin :show="true" :size="loadingSize" />
      </div>
      <div v-show="isEmpty" class="absolute-center">
        <div class="relative">
          <icon-local-empty-data :class="iconClass" />
          <p class="absolute-lb w-full text-center" :class="descClass">{{ emptyDesc }}</p>
        </div>
      </div>
      <div v-show="!network" class="absolute-center">
        <div class="relative" :class="{ 'cursor-pointer': showNetworkReload }" @click="handleReload">
          <icon-local-network-error :class="iconClass" />
          <p class="absolute-lb w-full text-center" :class="descClass">{{ networkErrorDesc }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onUnmounted, watch } from 'vue';
import { NETWORK_ERROR_MSG } from '@/config';
import { useBoolean } from '@/hooks';

defineOptions({ name: 'LoadingEmptyWrapper' });

interface Props {
  /** 是否加载 */
  loading: boolean;
  /** 是否为空 */
  empty?: boolean;
  /** 加载图标的大小 */
  loadingSize?: 'small' | 'medium' | 'large';
  /** 中间占位符的class */
  placeholderClass?: string;
  /** 空数据描述文本 */
  emptyDesc?: string;
  /** 图标的class */
  iconClass?: string;
  /** 描述文本的class */
  descClass?: string;
  /** 显示网络异常的重试点击按钮 */
  showNetworkReload?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  empty: false,
  loadingSize: 'medium',
  placeholderClass: 'bg-white dark:bg-dark transition-background-color duration-300 ease-in-out',
  emptyDesc: '暂无数据',
  iconClass: 'text-320px text-primary',
  descClass: 'text-16px text-[#666]',
  showNetworkReload: false
});

// 网络状态
const { bool: network, setBool: setNetwork } = useBoolean(window.navigator.onLine);
const { bool: reloadFlag, setBool: setReload } = useBoolean(true);

// 数据是否为空
const isEmpty = computed(() => props.empty && !props.loading && network.value);

const showPlaceholder = computed(() => props.loading || isEmpty.value || !network.value);

const networkErrorDesc = computed(() =>
  props.showNetworkReload ? `${NETWORK_ERROR_MSG}, 点击重试` : NETWORK_ERROR_MSG
);

function handleReload() {
  if (!props.showNetworkReload) return;
  setReload(false);
  nextTick(() => {
    setReload(true);
  });
}

const stopHandle = watch(
  () => props.loading,
  newValue => {
    // 结束加载判断一下网络状态
    if (!newValue) {
      setNetwork(window.navigator.onLine);
    }
  }
);

onUnmounted(() => {
  stopHandle();
});
</script>

<style scoped></style>
