<script setup lang="ts">
import {useRouterPush} from '@/hooks/common/router';

import {SsoAuthor} from '@/enum';
import {useAuthStore} from '@/store/modules/auth';

defineOptions({
  name: 'SsoLogin'
});

const {toggleLoginModule} = useRouterPush();

const ssoAuthor = SsoAuthor;
const authStore = useAuthStore();
const {toLogin} = useRouterPush();

async function toggleSsoLogin(author: string) {
  const url = await authStore.fetchSsoUrl(author);
  console.log(url)
  if (url) {
    window.open(url, '_self');
  } else {
    toLogin();
  }
}
</script>

<template>
  <NSpace vertical :size="18" class="w-full">
    <NGrid cols="s:1 m:2 l:4" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi v-for="item in ssoAuthor" :key="item">
        <NButton size="large" type="info" round secondary block @click="toggleSsoLogin(item)">
          {{ item }}
        </NButton>
      </NGi>
    </NGrid>
    <!--    <NButton size="large" round block @click="toggleLoginModule('pwd-login')">-->
    <!--      {{ $t('page.login.common.back') }}-->
    <!--    </NButton>-->
  </NSpace>
</template>

<style scoped></style>
