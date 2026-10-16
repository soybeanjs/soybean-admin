<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { SButton } from '@vean/ui';
import { useAuthStore } from '@/store/modules/auth';
import forbiddenIllustration from '@/assets/exception/403.svg';
import notFoundIllustration from '@/assets/exception/404.svg';
import serviceErrorIllustration from '@/assets/exception/500.svg';

/** 与 unify 版本的差异： 详见 docs/v3-notes.md N-030。 */
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
const router = useRouter();

function goBack(): void {
  router.back();
}

function goHome(): void {
  void router.push(authStore.homePath);
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
