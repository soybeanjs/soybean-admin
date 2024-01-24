<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { useRouterPush } from '@/hooks/common/router';
import { $t } from '@/locales';

const route = useRoute();
const { routerPushByKey } = useRouterPush();

const routeQuery = computed(() => JSON.stringify(route.query));
</script>

<template>
  <div>
    <LookForward>
      <div>
        <NButton @click="routerPushByKey('function_tab')">{{ $t('page.function.multiTab.backTab') }}</NButton>
        <div class="py-24px">{{ $t('page.function.multiTab.routeParam') }}: {{ routeQuery }}</div>
      </div>
    </LookForward>
  </div>
</template>

<style scoped></style>
