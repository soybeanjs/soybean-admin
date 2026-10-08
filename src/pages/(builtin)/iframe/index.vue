<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { SCard, SEmpty } from '@vean/ui';
import { resolveIframeUrl } from '@/shared/iframe';

/**
 * iframe 内嵌外链页（P3-07，v3 §4.2 的 `(builtin)/iframe/[url].vue`）。
 *
 * 地址来源：`?url=` 查询串。dynamic 模式下菜单行 `iframeUrl` 无法映射成路由
 * 参数（URL 含 `//`、`?`，当路径段会被 router 拆碎），所以`transformMenuToRoute`
 * 生成的是一条 `redirect: { path: '/iframe', query: { url } }` 的路由；静态声明
 * 或手动使用也一律走同一条 query 通道。
 *
 * 安全：只接受 `http(s)` 协议（`javascript:` / `data:` 会被浏览器拒绝执行脚本
 * 但也可能被当作下载，一律拦掉）；无 sandbox 是刻意的 —— 内嵌页需要自己的
 * 脚本与存储，sandbox 会让常见站点白屏。此处只做协议白名单。
 */
definePage({
  name: 'IframeUrl',
  requiresAuth: false,
  meta: {
    title: '内嵌页面',
    i18nKey: 'common.iframePage',
    hideInMenu: true
  }
});

const { t } = useI18n();
const route = useRoute();

/** 候选地址：`?url=` 查询串 */
const rawUrl = computed(() => {
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
