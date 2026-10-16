<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { SCard, STag } from '@vean/ui';

/** 隐藏子菜单的共享内容块（P3-06） 详见 docs/v3-notes.md N-308。 */
defineOptions({ name: 'HideChildPanel' });

const props = defineProps<{
  /** 卡片标题（文案由页面以静态 `t()` key 解析后传入） */
  title: string;
  /** 说明文案 */
  description: string;
  /** 「当前路由」标签文案 */
  routeLabel: string;
}>();

const route = useRoute();

const currentRouteName = computed(() => String(route.name ?? '-'));
</script>

<template>
  <SCard :title="props.title">
    <p class="text-sm opacity-70">{{ props.description }}</p>
    <p class="mt-3 flex items-center gap-2 text-sm">
      <span class="opacity-60">{{ props.routeLabel }}</span>
      <STag variant="soft" color="primary">{{ currentRouteName }}</STag>
    </p>
  </SCard>
</template>
