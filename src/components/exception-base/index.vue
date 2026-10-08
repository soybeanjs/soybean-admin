<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { SButton } from '@vean/ui';
import { useAuthStore } from '@/store/modules/auth';
import forbiddenIllustration from '@/assets/exception/403.svg';
import notFoundIllustration from '@/assets/exception/404.svg';
import serviceErrorIllustration from '@/assets/exception/500.svg';
import { getRouter } from '@/router/instance';

/**
 * 异常页统一壳（P3-07，替代 unify 的 `components/exception-base.vue`）。
 *
 * 三个异常页（403 / 404 / 500）只差「码、插图、文案、额外动作」，骨架收在这里，
 * 页面只传码与文案，并在默认插槽追加自己的动作（如 403 的「重新登录」）。
 *
 * 与 unify 版本的差异：
 * - 插图用**本地 SVG**（unify 用 `local:no-permission` 本地图标字体；本仓没有
 *   那套图标字体，且远程 iconify 在离线/首屏时要等网络）。`import` 之后交给
 *   Vite 资源管线，dev/build 都不缺；`?raw` 内联能跟随 `currentColor`，但
 *   raw SVG 上的 `size-*` 工具类不生效，所以这里取 URL 形态 + 固定尺寸。
 * - 动作固定「返回上一页 / 回到首页」两颗，其余动作走默认插槽。
 * - 刻意不用 `SEmpty`：它面向「列表无数据」的小型占位，`media` 尺寸上限偏小，
 *   异常页需要的是大插图 + 码 + 标题 + 说明 + 动作组的完整版面。
 */
defineOptions({ name: 'ExceptionBase' });

const props = defineProps<{
  /** 异常码，同时用于图注与无障碍文本 */
  code: '403' | '404' | '500';
  /** 主标题（调用方用静态 t() key 解析后传入） */
  title: string;
  /** 补充说明 */
  description: string;
}>();

const { t } = useI18n();
const authStore = useAuthStore();

/** 三张插图按码取用（静态映射，避免把码拼进资源路径） */
const illustrationMap = {
  403: forbiddenIllustration,
  404: notFoundIllustration,
  500: serviceErrorIllustration
};

const illustration = computed(() => illustrationMap[props.code]);
const codeText = computed(() => props.code);

function goBack(): void {
  getRouter().back();
}

function goHome(): void {
  void getRouter().push(authStore.homePath);
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 py-16">
    <img :src="illustration" :alt="codeText" class="h-44 w-60 object-contain" />
    <p class="text-5xl font-700">{{ codeText }}</p>
    <p class="text-base font-600">{{ props.title }}</p>
    <p class="max-w-120 text-center text-sm opacity-60">{{ props.description }}</p>

    <div class="mt-3 flex gap-3">
      <SButton variant="outline" @click="goBack">{{ t('common.goBack') }}</SButton>
      <SButton variant="soft" @click="goHome">{{ t('common.backHome') }}</SButton>
      <slot />
    </div>
  </div>
</template>
