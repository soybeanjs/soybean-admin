<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { SButton, SCard, SForm, SInput, STextarea, toast, useForm } from '@vean/ui';
import { useAuthStore } from '@/store';
import { useHydrated } from '@/composables/use-hydrated';
import { api } from '@/request';
import { EMPTY_PROFILE_FORM, profileFormSchema, toProfileFormValues, toUpdateProfilePayload } from '@/schema/profile';
import type { ProfileFormValues } from '@/schema/profile';

/** 个人资料编辑卡（个人中心） 详见 docs/v3-notes.md N-382。 */

defineOptions({ name: 'UserCenterProfileForm' });

const { t } = useI18n();

/** 是否已完成客户端挂载 详见 docs/v3-notes.md N-383。 */
const hydrated = useHydrated();

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

  // 水合前固定空表单：SSR 与水合首帧必须同值，真实值等挂载后由下面的 watch 回填
  if (!hydrated.value) return { ...EMPTY_PROFILE_FORM };

  return user ? toProfileFormValues(user) : { ...EMPTY_PROFILE_FORM, homePath: authStore.homePath };
});

async function save(values: ProfileFormValues): Promise<void> {
  loading.value = true;

  try {
    const user = await api.put('/auth/profile', { body: toUpdateProfilePayload(values) });
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
