<template>
  <div class="h-full">
    <n-card title="权限指令 v-permission" class="h-full shadow-sm rounded-16px">
      <div class="pb-12px">
        <n-gradient-text type="primary" :size="20">当前用户的权限：{{ auth.userInfo.userRole }}</n-gradient-text>
      </div>
      <n-space>
        <n-button v-permission="`super`">super可见</n-button>
        <n-button v-permission="`admin`">admin可见</n-button>
        <n-button v-permission="['admin', 'test']">admin和test可见</n-button>
      </n-space>
      <div class="py-12px">
        <n-gradient-text type="primary" :size="20">切换用户权限</n-gradient-text>
      </div>
      <n-select
        :value="auth.userInfo.userRole"
        class="w-120px"
        size="small"
        :options="roleList"
        @update:value="auth.updateUserRole"
      />
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useAppStore, useAuthStore } from '@/store';

const app = useAppStore();
const auth = useAuthStore();

const roleList = [
  { label: '超级管理员', value: 'super' },
  { label: '管理员', value: 'admin' },
  { label: '测试', value: 'test' }
];

watch(
  () => auth.userInfo.userRole,
  async () => {
    app.reloadPage();
  }
);
</script>
<style scoped></style>
