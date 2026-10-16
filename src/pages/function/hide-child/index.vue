<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { SButton, SCard, STag } from '@vean/ui';

/** 隐藏子菜单（P3-06，v3 §4.6） 详见 docs/v3-notes.md N-307。 */
defineOptions({ name: 'FunctionHideChild' });

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

/** 当前路由名（子页/父页共用同一视图，用它区分展示） */
const currentRouteName = computed(() => String(route.name ?? '-'));

/** 高亮目标：三个隐藏子页都指回父菜单路由名 */
const activeMenuText = computed(() => route.meta.activeMenu ?? currentRouteName.value);

function toOne(): void {
  void router.push('/function/hide-child/one');
}

function toTwo(): void {
  void router.push('/function/hide-child/two');
}

function toThree(): void {
  void router.push('/function/hide-child/three');
}

function toParent(): void {
  void router.push('/function/hide-child');
}

definePage({
  meta: {
    title: '隐藏子菜单',
    i18nKey: 'route.functionHideChild',
    icon: 'mdi:eye-off-outline',
    order: 24
  }
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <SCard :title="t('function.hideChild.title')">
      <p class="text-sm opacity-70">{{ t('function.hideChild.description') }}</p>
      <p class="mt-3 flex items-center gap-2 text-sm">
        <span class="opacity-60">{{ t('function.hideChild.routeLabel') }}</span>
        <STag variant="soft" color="primary">{{ currentRouteName }}</STag>
      </p>
      <p class="mt-3 text-sm opacity-60">{{ t('function.hideChild.hint', { activeMenu: activeMenuText }) }}</p>
    </SCard>

    <SCard :title="t('common.actions')">
      <div class="flex flex-wrap gap-3">
        <SButton variant="outline" @click="toParent">{{ t('function.hideChild.title') }}</SButton>
        <SButton variant="outline" @click="toOne">{{ t('route.functionHideChildOne') }}</SButton>
        <SButton variant="outline" @click="toTwo">{{ t('route.functionHideChildTwo') }}</SButton>
        <SButton variant="outline" @click="toThree">{{ t('route.functionHideChildThree') }}</SButton>
      </div>
      <p class="mt-3 text-sm opacity-60">{{ t('function.hideChild.hint') }}</p>
    </SCard>
  </div>
</template>
