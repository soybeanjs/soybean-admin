<template>
  <n-space :vertical="true">
    <n-divider class="!mb-0 text-14px text-#666">{{ $t('page.login.pwdLogin.otherLoginMode') }}</n-divider>
    <div class="flex-center">
      <n-button :text="true">
        <icon-mdi-wechat class="text-22px text-#888 hover:text-#52BF5E" />
      </n-button>
    </div>
  </n-space>
</template>

<script lang="ts" setup>
import { $t } from '@/locales';
</script>

<style scoped></style>
