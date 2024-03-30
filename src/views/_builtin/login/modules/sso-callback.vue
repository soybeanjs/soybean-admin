<script setup lang="ts">
import {onBeforeMount} from 'vue';
import {useRoute} from 'vue-router';
import {useRouterPush} from '@/hooks/common/router';
import {useAuthStore} from '@/store/modules/auth';
import {$t} from '@/locales';
import {SsoAuthor} from '@/enum';
import {useRouteStore} from '@/store/modules/route';

defineOptions({
  name: 'SsoCallback'
});

const route = useRoute();
const routeStore = useRouteStore();
const routerPush = useRouterPush();
const authStore = useAuthStore();

onBeforeMount(async () => {
  const success = await authStore.loginSso(
    String(route.params.author),
    String(route.query.code),
    String(route.query.state)
  );
  if (success) {
    routerPush.redirectFromLogin();
    if (routeStore.isInitAuthRoute) {
      window.$notification?.success({
        title: $t('page.login.common.loginSuccess'),
        content: $t('page.login.common.welcomeBack', {userName: authStore.userInfo.userName}),
        duration: 4500
      });
    }
  } else {
    routerPush.toLogin();
  }
});

const {toggleLoginModule} = useRouterPush();

async function toggleSsoLogin(author: string) {
  const url = await authStore.fetchSsoUrl(author);
  if (url) {
    window.open(url, '_self');
  } else {
    routerPush.toLogin();
  }
}
</script>

<template>
  <NSpace vertical :size="18" class="w-full">
    <NGrid cols="s:1 m:2 l:4" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi v-for="item in SsoAuthor" :key="item">
        <NButton size="large" type="info" round secondary block @click="toggleSsoLogin(item)">
          {{ item }}
        </NButton>
      </NGi>
    </NGrid>
    <NButton size="large" round block @click="toggleLoginModule('pwd-login')">
      {{ $t('page.login.common.back') }}
    </NButton>
  </NSpace>
</template>

<style scoped></style>

<style scoped></style>
