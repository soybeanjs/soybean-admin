<template>
  <n-space :vertical="true">
    <n-divider class="!mb-0 text-14px text-#666">{{ $t('page.login.pwdLogin.otherAccountLogin') }}</n-divider>
    <n-space justify="center">
      <n-button
        v-for="item in accounts"
        :key="item.userName"
        type="primary"
        @click="login(item.userName, item.password)"
      >
        {{ item.label }}
      </n-button>
    </n-space>
  </n-space>
</template>

<script lang="ts" setup>
import { userRoleLabels } from '@/constants';
import { $t } from '@/locales';

interface Emits {
  (e: 'login', param: { userName: string; password: string }): void;
}

const emit = defineEmits<Emits>();

interface Account {
  key: Auth.RoleType;
  label: string;
  userName: string;
  password: string;
}

const accounts: Account[] = [
  {
    key: 'super',
    label: userRoleLabels.super,
    userName: 'Super',
    password: 'super123'
  },
  {
    key: 'admin',
    label: userRoleLabels.admin,
    userName: 'Admin',
    password: 'admin123'
  },
  {
    key: 'user',
    label: userRoleLabels.user,
    userName: 'User01',
    password: 'user01123'
  }
];

function login(userName: string, password: string) {
  emit('login', { userName, password });
}
</script>

<style scoped></style>
