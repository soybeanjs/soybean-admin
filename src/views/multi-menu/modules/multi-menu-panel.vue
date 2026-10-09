<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { SCard, STag } from '@vean/ui';
import { useMenuStore } from '@/store';
import { findMenuTrail } from '@/store/modules/menu';

/**
 * 多级菜单演示的共享内容块（P3-10）。
 *
 * 四个页面（一级 + 二级 + 二级(有子) + 三级）是同一模板的四份实例，
 * 收敛成这个组件，避免四份重复的卡片骨架。
 *
 * 层级链由菜单树现算，而不是读路由 —— 证据是**建树结果**：
 * 菜单是从 `meta.menuParent` 声明出来的，不是从 path 前缀猜出来的。
 *
 * 高亮值与链路同源：`meta.activeMenu` 优先（隐藏子页指回父菜单），
 * 与 `src/layouts/default.vue` 的 `activeMenuValue` 同一判据。
 */
defineOptions({ name: 'MultiMenuPanel' });

const props = defineProps<{
  /** 卡片标题（文案由页面以静态 `t()` key 解析后传入） */
  title: string;
  /** 说明文案 */
  description: string;
}>();

const { t } = useI18n();
const route = useRoute();
const menuStore = useMenuStore();

const currentRouteName = computed(() => String(route.name ?? '-'));

/** 当前激活菜单值（与布局同一判据） */
const activeMenuValue = computed(() => route.meta.activeMenu ?? currentRouteName.value);

/** 根 → 当前节点的菜单链（多级菜单的核心证据） */
const trail = computed(() => findMenuTrail(menuStore.items, activeMenuValue.value));

/** 层级深度（1 = 一级菜单） */
const level = computed(() => trail.value.length);
</script>

<template>
  <SCard :title="props.title">
    <p class="text-sm opacity-70">{{ props.description }}</p>

    <dl class="mt-4 grid gap-3 text-sm sm:grid-cols-2">
      <div class="flex items-center gap-2">
        <dt class="opacity-60">{{ t('multiMenu.currentRoute') }}</dt>
        <dd>
          <STag variant="soft" color="primary">{{ currentRouteName }}</STag>
        </dd>
      </div>

      <div class="flex items-center gap-2">
        <dt class="opacity-60">{{ t('multiMenu.level') }}</dt>
        <dd>
          <STag variant="soft" color="success">{{ level }}</STag>
        </dd>
      </div>

      <div class="flex items-center gap-2 sm:col-span-2">
        <dt class="shrink-0 opacity-60">{{ t('multiMenu.trail') }}</dt>
        <dd class="flex flex-wrap items-center gap-1.5">
          <template v-for="(node, index) in trail" :key="node.value">
            <span v-if="index > 0" class="opacity-40">/</span>
            <STag variant="outline" color="carbon">{{ node.label }}</STag>
          </template>
        </dd>
      </div>
    </dl>

    <div class="mt-4">
      <slot />
    </div>
  </SCard>
</template>
