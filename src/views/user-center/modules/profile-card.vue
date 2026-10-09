<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { SAvatar, SCard, STag } from '@vean/ui';
import { useAuthStore } from '@/store';
import EnabledTag from '@/components/enabled-tag/index.vue';

/**
 * 用户信息概览卡（个人中心左侧）。
 *
 * 只读视图 —— 可编辑字段在右侧表单里，这里刻意不重复渲染输入控件，避免同一
 * 份数据出现两个真相源（改表单后卡片不刷新、或卡片改了表单不认）。
 */

defineOptions({ name: 'UserCenterProfileCard' });

const { t } = useI18n();

const authStore = useAuthStore();

const user = computed(() => authStore.userInfo);

const avatarText = computed(() => (user.value?.fullName ?? user.value?.username ?? 'U').slice(0, 1).toUpperCase());

/** 空值统一显示 `-`（与 manage 页表格同一约定） */
function display(value: string | null | undefined): string {
  return value && value.trim() !== '' ? value : '-';
}
</script>

<template>
  <SCard :title="t('userCenter.profile.title')">
    <div class="flex flex-col items-center gap-3 py-2">
      <SAvatar :src="user?.avatar ?? ''" :fallback-label="avatarText" size="lg" />
      <div class="flex flex-col items-center gap-1">
        <span class="text-base font-600">{{ display(user?.fullName) }}</span>
        <span class="text-sm opacity-60">@{{ display(user?.username) }}</span>
      </div>
      <EnabledTag v-if="user" :enabled="user.enabled" />
    </div>

    <div class="mt-2 flex flex-col gap-2 border-t border-border pt-3 text-sm">
      <div class="flex items-center justify-between gap-3">
        <span class="opacity-60">{{ t('userCenter.profile.email') }}</span>
        <span class="truncate">{{ display(user?.email) }}</span>
      </div>
      <div class="flex items-center justify-between gap-3">
        <span class="opacity-60">{{ t('userCenter.profile.phone') }}</span>
        <span class="truncate">{{ display(user?.phone) }}</span>
      </div>
      <div class="flex items-center justify-between gap-3">
        <span class="opacity-60">{{ t('userCenter.profile.homePath') }}</span>
        <span class="truncate">{{ display(user?.homePath) }}</span>
      </div>
    </div>

    <div class="mt-3 flex flex-col gap-2 border-t border-border pt-3">
      <span class="text-sm opacity-60">{{ t('userCenter.profile.roles') }}</span>
      <div v-if="user?.roles.length" class="flex flex-wrap gap-1">
        <STag v-for="role in user.roles" :key="role" variant="soft" color="primary">{{ role }}</STag>
      </div>
      <span v-else class="text-sm">-</span>
    </div>
  </SCard>
</template>
