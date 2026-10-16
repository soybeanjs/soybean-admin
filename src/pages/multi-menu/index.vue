<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { SButton } from '@vean/ui';
import MultiMenuPanel from './modules/multi-menu-panel.vue';

/** 多级菜单演示 · 一级（P3-10） 详见 docs/v3-notes.md N-337。 */
defineOptions({ name: 'MultiMenuIndex' });

const { t } = useI18n();
const router = useRouter();

function toSecond(): void {
  void router.push('/multi-menu/first/second');
}

function toThird(): void {
  void router.push('/multi-menu/first/second-new/third');
}

/** 多级菜单演示 · 一级（P3-10，v3 §4.6「保留（文件目录天然表达）」） 详见 docs/v3-notes.md N-338。 */
definePage({
  meta: {
    title: '多级菜单',
    i18nKey: 'route.multiMenu',
    icon: 'mdi:file-tree',
    order: 26
  }
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <MultiMenuPanel :title="t('route.multiMenu')" :description="t('multiMenu.firstDesc')">
      <div class="flex flex-wrap gap-3">
        <SButton variant="outline" @click="toSecond">{{ t('route.multiMenuSecond') }}</SButton>
        <SButton variant="outline" @click="toThird">{{ t('route.multiMenuThird') }}</SButton>
      </div>
    </MultiMenuPanel>
  </div>
</template>
