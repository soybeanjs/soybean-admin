<script setup lang="ts">
import { $t } from '@/locales';
import { fetchCustomBackendError } from '@/service/api';

async function logout() {
  await fetchCustomBackendError('8888', $t('request.logoutMsg'));
}

async function logoutWithModal() {
  await fetchCustomBackendError('7777', $t('request.logoutWithModalMsg'));
}

async function refreshToken() {
  await fetchCustomBackendError('9999', $t('request.tokenExpired'));
}
</script>

<template>
  <NSpace vertical :size="16">
    <NCard :title="$t('request.logout')" :bordered="false" size="small" segmented class="card-wrapper">
      <NButton @click="logout">{{ $t('common.trigger') }}</NButton>
    </NCard>
    <NCard :title="$t('request.logoutWithModal')" :bordered="false" size="small" segmented class="card-wrapper">
      <NButton @click="logoutWithModal">{{ $t('common.trigger') }}</NButton>
    </NCard>
    <NCard :title="$t('request.refreshToken')" :bordered="false" size="small" segmented class="card-wrapper">
      <NButton @click="refreshToken">{{ $t('common.trigger') }}</NButton>
    </NCard>
  </NSpace>
</template>

<style scoped></style>
