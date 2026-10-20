<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { SCard, SEmpty } from '@vean/ui';
import { resolveIframeUrl } from '@/shared/iframe';

/** iframe 内嵌外链页（P3-07，v3 §4.2 的 `(builtin)/iframe/[url].vue`） 详见 docs/v3-notes.md N-290。 */
definePage({
  name: 'IframeUrl',
  meta: {
    title: '内嵌页面',
    i18nKey: 'common.iframePage',
    hideInMenu: true,
    requiresAuth: false
  }
});

const { t } = useI18n();
const route = useRoute();

/** 候选地址：路由 `meta.iframeUrl`（文件化内嵌菜单）优先，回退到 `?url=` 查询串 */
const rawUrl = computed(() => {
  const fromMeta = route.meta.iframeUrl;

  if (typeof fromMeta === 'string' && fromMeta.length > 0) return fromMeta;

  const fromQuery = route.query.url;

  return typeof fromQuery === 'string' ? fromQuery : '';
});

/** 协议白名单校验（`src/shared/iframe.ts`，与布局的新窗口打开共用） */
const safeUrl = computed(() => resolveIframeUrl(rawUrl.value));
</script>

<template>
  <div class="h-full min-h-125 flex-c-stretch">
    <iframe v-if="safeUrl" :src="safeUrl" class="size-full border-0" allowfullscreen></iframe>

    <SCard v-else class="flex-1-hidden">
      <SEmpty icon="mdi:link-variant-off" :title="t('common.iframePage')" :description="t('common.iframeInvalidUrl')" />
    </SCard>
  </div>
</template>
