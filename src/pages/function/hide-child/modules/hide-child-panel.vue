<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { SCard, STag } from '@vean/ui';

/**
 * 隐藏子菜单的共享内容块（P3-06）。
 *
 * 三个隐藏子页（one/two/three）是同一视觉模板的三份实例：路由各自独立
 * （各占一个页签），但菜单里不可见（`hideInMenu: true`），侧栏高亮由
 * `meta.activeMenu` 指回父菜单 `/function/hide-child`。
 * 收敛成这个组件，避免三份重复的卡片骨架。
 */
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
