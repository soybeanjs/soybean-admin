<template>
  <div>
    <h3>System</h3>
    <n-button>
      <router-link to="/home">home</router-link>
    </n-button>
    <n-switch :value="true" />
    <n-button @click="showModal = true">来吧</n-button>
    <n-modal v-model:show="showModal">
      <n-card style="width: 600px" title="模态框" :bordered="false" size="huge">
        <template #header-extra>噢！</template>
        内容
        <template #footer>尾部</template>
      </n-card>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { NButton, NSwitch, NModal, NCard } from 'naive-ui';

const showModal = ref(false);
</script>
<style scoped></style>
