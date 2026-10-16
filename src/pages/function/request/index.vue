<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { SButton, SCard } from '@vean/ui';
import { api } from '@/request';

/** 演示的是**请求层的错误分派**，不是页面自己的 try/catch： 详见 docs/v3-notes.md N-310。 */
defineOptions({ name: 'FunctionRequest' });

const { t } = useI18n();

/** 并发按钮的忙碌标记（单飞刷新是请求层行为，这里只是按钮反馈） */
const busy = ref(false);

async function send(code?: string): Promise<void> {
  busy.value = true;

  try {
    await api.post('/auth/error', { query: code ? { code } : {} });
  } catch {
    // 请求层已提示/已分派；这里只吞掉 Promise 拒绝避免 unhandled rejection
  } finally {
    busy.value = false;
  }
}

/** 普通失败：不传 code → 后端抛 `SYSTEM_ERROR`（1000） */
function onSystemError() {
  void send();
}

/** 静默登出：8888 → 清会话 + toast（不弹窗） */
function onSilentLogout() {
  void send('8888');
}

/** 弹窗登出：7777 → 清会话 + `dialog.warning` */
function onModalLogout() {
  void send('7777');
}

/** 刷新令牌：9999 → 触发单飞刷新并重放（未登录会直接失败，属预期） */
function onRefreshToken() {
  void send('9999');
}

/** 并发 3 次同文案普通错误 → 验证 3s 去重只弹一次 */
function onRepeatedMessage() {
  void Promise.all([send(), send(), send()]);
}

/** 并发 3 次弹窗登出 → 验证只弹一次确认框 */
function onRepeatedModal() {
  void Promise.all([send('7777'), send('7777'), send('7777')]);
}

definePage({
  meta: {
    title: '请求演示',
    i18nKey: 'route.functionRequest',
    icon: 'mdi:swap-horizontal',
    order: 22
  }
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <SCard :title="t('function.request.title')">
      <p class="text-sm opacity-70">{{ t('function.request.description') }}</p>
      <p class="mt-2 text-sm opacity-60">{{ t('function.request.codeHint') }}</p>
    </SCard>

    <SCard :title="t('common.actions')">
      <div class="flex flex-wrap gap-3">
        <SButton variant="outline" :loading="busy" @click="onSystemError">
          {{ t('function.request.systemError') }}
        </SButton>
        <SButton variant="soft" color="warning" :loading="busy" @click="onSilentLogout">
          {{ t('function.request.silentLogout') }}
        </SButton>
        <SButton variant="soft" color="destructive" :loading="busy" @click="onModalLogout">
          {{ t('function.request.modalLogout') }}
        </SButton>
        <SButton variant="soft" color="info" :loading="busy" @click="onRefreshToken">
          {{ t('function.request.refreshToken') }}
        </SButton>
      </div>
    </SCard>

    <SCard :title="t('common.actions')">
      <div class="flex flex-wrap gap-3">
        <SButton variant="dashed" :loading="busy" @click="onRepeatedMessage">
          {{ t('function.request.repeatedMessage') }}
        </SButton>
        <SButton variant="dashed" :loading="busy" @click="onRepeatedModal">
          {{ t('function.request.repeatedModal') }}
        </SButton>
      </div>
    </SCard>
  </div>
</template>
