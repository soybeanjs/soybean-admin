<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { SButton, SCard, SForm, SInput, STextarea, toast, useForm } from '@vean/ui';
import { fetchUpdateProfile } from '@/service/api/auth';
import { useAuthStore } from '@/store';
import { EMPTY_PROFILE_FORM, profileFormSchema, toProfileFormValues, toUpdateProfilePayload } from '@/schema/profile';
import type { ProfileFormValues } from '@/schema/profile';

/**
 * 个人资料编辑卡（个人中心）。
 *
 * 复用点：schema 来自 `@/schema/profile`（`profileFormSchema`），提交时经
 * `toUpdateProfilePayload` 把空串转 `null` 再交给 `PUT /api/auth/profile`
 * —— 校验规则与后端 `profileUpdateSchema` 是同一份代码（P3-05 的 StandardSchema 复用范式）。
 *
 * 回填走 `form.reset(values)`：`useForm` 的 `defaultValues` 在组合时固化，
 * TanStack 的 `reset` 才会一并替换 `defaultValues`（否则「取消后回到初值」会回到
 * 首次挂载时的旧快照）。
 */

defineOptions({ name: 'UserCenterProfileForm' });

const { t } = useI18n();

const authStore = useAuthStore();

const loading = ref(false);

const { SFormField, form, handleSubmit } = useForm({
  schema: profileFormSchema,
  defaultValues: EMPTY_PROFILE_FORM,
  onSubmit: async values => {
    await save(values);
  }
});

/** 当前用户信息 → 表单初值（`null` 统一转空串） */
const currentValues = computed<ProfileFormValues>(() => {
  const user = authStore.userInfo;

  return user ? toProfileFormValues(user) : { ...EMPTY_PROFILE_FORM, homePath: authStore.homePath };
});

async function save(values: ProfileFormValues): Promise<void> {
  loading.value = true;

  try {
    const user = await fetchUpdateProfile(toUpdateProfilePayload(values));
    // 响应回填 store：头像/首页/角色标签等其它区域同步刷新
    authStore.setUserInfo(user);
    form.reset(toProfileFormValues(user));
    toast.success(t('userCenter.profile.saveSuccess'));
  } finally {
    loading.value = false;
  }
}

/** 放弃改动：把表单恢复到当前用户信息 */
function onReset(): void {
  form.reset(currentValues.value);
}

watch(
  currentValues,
  values => {
    // 用户信息晚于表单挂载到位（刷新页面时 `initUserInfo` 是异步的），
    // 所以要在 it 到达时重新回填，否则表单停在空值上。
    if (!form.state.isTouched) {
      form.reset(values);
    }
  },
  { immediate: true }
);
</script>

<template>
  <SCard :title="t('userCenter.profile.editTitle')">
    <SForm class="grid gap-y-6" @submit.prevent="handleSubmit">
      <SFormField name="fullName" :label="t('userCenter.profile.fullName')">
        <SInput :placeholder="t('userCenter.profile.fullNamePlaceholder')" />
      </SFormField>

      <SFormField name="email" :label="t('userCenter.profile.email')">
        <SInput :placeholder="t('userCenter.profile.emailPlaceholder')" />
      </SFormField>

      <SFormField name="phone" :label="t('userCenter.profile.phone')">
        <SInput :placeholder="t('userCenter.profile.phonePlaceholder')" />
      </SFormField>

      <SFormField name="homePath" :label="t('userCenter.profile.homePath')">
        <SInput :placeholder="t('userCenter.profile.homePathPlaceholder')" />
      </SFormField>

      <SFormField name="description" :label="t('userCenter.profile.description')">
        <STextarea :placeholder="t('userCenter.profile.descriptionPlaceholder')" />
      </SFormField>

      <!-- 不是 submit 按钮：`useForm` 的提交入口由 SForm 的 @submit 承担 -->
      <div class="flex justify-end gap-3">
        <SButton type="button" variant="outline" @click="onReset">{{ t('common.reset') }}</SButton>
        <SButton type="button" :loading="loading" @click="handleSubmit">{{ t('common.confirm') }}</SButton>
      </div>
    </SForm>
  </SCard>
</template>
