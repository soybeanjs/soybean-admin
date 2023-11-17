<script setup lang="ts">
import { $t } from '@/locales';
import { useRouterPush } from '@/hooks/common/router';

defineOptions({
  name: 'CodeLogin'
});

const { toggleLoginModule } = useRouterPush();
</script>

<template>
  <NForm size="large" :show-label="false">
    <NFormItem>
      <NInput :placeholder="$t('page.login.common.phonePlaceholder')" />
    </NFormItem>
    <NFormItem>
      <NInput :placeholder="$t('page.login.common.codePlaceholder')" />
    </NFormItem>
    <NSpace vertical :size="18" class="w-full">
      <NButton type="primary" size="large" block round>
        {{ $t('common.confirm') }}
      </NButton>
      <NButton size="large" block round @click="toggleLoginModule('pwd-login')">
        {{ $t('page.login.common.back') }}
      </NButton>
    </NSpace>
  </NForm>
</template>

<style scoped></style>
