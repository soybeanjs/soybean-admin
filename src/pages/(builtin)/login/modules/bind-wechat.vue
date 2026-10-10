<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { SButton, toast } from '@vean/ui';
import { fetchBindWechat, fetchWechatBinding, fetchWechatQrcode } from '@/service/api/auth';
import { useAuthStore } from '@/store/modules/auth';
import type { ApiWechatQrcode } from '@/typings/app';
import { gotoLoginModule } from '../use-login';

/**
 * 绑定微信（v3 §4.6）。
 *
 * ⚠️ 本模块**需要登录态**：绑定是账号级操作，服务端 `GET/POST
 * /api/auth/bind-wechat` 走默认鉴权；未登录时只提示去登录，不发请求
 * （避免 401 触发全局登出回调）。
 *
 * mock 说明：无微信开放平台凭证，服务端 `wechat-qrcode` 只下发 ticket +
 * 形似 `qrconnect` 的 url；这里用 ticket 派生 21×21 伪点阵（含三个定位角）
 * 作占位二维码，「模拟扫码」提交 ticket 完成绑定。
 */
defineOptions({ name: 'BindWechat' });

/** 占位二维码边长（格） */
const QR_SIZE = 21;

const { t } = useI18n();
const authStore = useAuthStore();

const qrcode = ref<ApiWechatQrcode | null>(null);
const nickname = ref<string | null>(null);
const loadingQrcode = ref(false);
const binding = ref(false);

const bound = computed(() => nickname.value !== null);

/** 由 ticket 派生的伪随机点阵（同一 ticket 恒定渲染，刷新二维码即换图） */
const qrCells = computed(() => {
  const seed = qrcode.value?.ticket ?? '';
  const cells: boolean[] = [];
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }
  for (let index = 0; index < QR_SIZE * QR_SIZE; index += 1) {
    hash = (hash * 1103515245 + 12345) >>> 0;
    cells.push(((hash >>> 16) & 1) === 1);
  }

  return cells;
});

/** 定位角（7×7 回字框）命中判定：某格是否落在指定角标的回字框内 */
function matchFinder(row: number, col: number, top: number, left: number): boolean {
  const rowOffset = row - top;
  const colOffset = col - left;

  if (rowOffset < 0 || rowOffset > 6 || colOffset < 0 || colOffset > 6) return false;

  const onBorder = rowOffset === 0 || rowOffset === 6 || colOffset === 0 || colOffset === 6;
  const inCore = rowOffset >= 2 && rowOffset <= 4 && colOffset >= 2 && colOffset <= 4;

  return onBorder || inCore;
}

function inFinder(row: number, col: number): boolean {
  return matchFinder(row, col, 0, 0) || matchFinder(row, col, 0, QR_SIZE - 7) || matchFinder(row, col, QR_SIZE - 7, 0);
}

function isCellOn(index: number): boolean {
  const row = Math.floor(index / QR_SIZE);
  const col = index % QR_SIZE;

  return inFinder(row, col) || qrCells.value[index] === true;
}

async function refreshQrcode(): Promise<void> {
  loadingQrcode.value = true;

  try {
    qrcode.value = await fetchWechatQrcode();
  } catch {
    // 请求层已 toast
  } finally {
    loadingQrcode.value = false;
  }
}

/** 已登录时拉取绑定状态；未绑定再取二维码 */
async function initModule(): Promise<void> {
  if (!authStore.isLogin) return;

  try {
    const status = await fetchWechatBinding();
    nickname.value = status.nickname;
  } catch {
    // 请求层已 toast
  }

  if (!bound.value) await refreshQrcode();
}

async function handleMockScan(): Promise<void> {
  if (!qrcode.value) return;

  binding.value = true;

  try {
    const result = await fetchBindWechat(qrcode.value.ticket);
    nickname.value = result.nickname;
    toast.success(t('login.bindSuccess'));
  } catch {
    // ticket 失效（过期/已消费）：换一张再试
    await refreshQrcode();
  } finally {
    binding.value = false;
  }
}

onMounted(initModule);
</script>

<template>
  <div v-if="!authStore.isLogin" class="flex flex-col items-center gap-4">
    <p class="text-sm text-gray-500">{{ t('login.wechatNeedLogin') }}</p>
    <SButton class="w-full" @click="gotoLoginModule('pwd-login')">{{ t('login.goLogin') }}</SButton>
  </div>

  <div v-else class="flex flex-col items-center gap-4">
    <template v-if="bound">
      <p class="text-sm">{{ t('login.wechatBound', { nickname }) }}</p>
      <SButton class="w-full" variant="outline" @click="refreshQrcode">{{ t('login.refreshQrcode') }}</SButton>
    </template>

    <template v-else>
      <div
        class="h-44 w-44 rounded border border-gray-200 p-2 dark:border-gray-700"
        :style="{ display: 'grid', gridTemplateColumns: `repeat(${QR_SIZE}, minmax(0, 1fr))` }"
      >
        <div
          v-for="index in QR_SIZE * QR_SIZE"
          :key="index"
          :class="isCellOn(index - 1) ? 'bg-gray-900' : 'bg-transparent'"
        />
      </div>
      <p class="text-center text-xs text-gray-500">{{ t('login.wechatTip') }}</p>
      <SButton class="w-full" :loading="binding" :disabled="!qrcode" @click="handleMockScan">
        {{ t('login.wechatMockScan') }}
      </SButton>
      <SButton class="w-full" variant="outline" :loading="loadingQrcode" @click="refreshQrcode">
        {{ t('login.refreshQrcode') }}
      </SButton>
    </template>

    <button type="button" class="text-sm text-primary hover:underline" @click="gotoLoginModule('pwd-login')">
      {{ t('login.backLogin') }}
    </button>
  </div>
</template>
