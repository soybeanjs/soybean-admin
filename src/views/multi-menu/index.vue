<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { SButton } from '@vean/ui';
import { getRouter } from '@/router/instance';
import MultiMenuPanel from './modules/multi-menu-panel.vue';

/**
 * 多级菜单演示 · 一级（P3-10）。
 *
 * 菜单树形（一级 › 二级 › 二级(有子) › 三级）由 `meta.menuParent` 声明建出，
 * 侧栏会在本项下展开两级子菜单 —— 这就是 v2「多级菜单」演示的等价行为，
 * v3 用文件目录 + 显式父声明表达（ubean 的 `PageMeta` 没有嵌套语法）。
 */
defineOptions({ name: 'MultiMenuIndex' });

const { t } = useI18n();

function toSecond(): void {
  void getRouter().push('/multi-menu/first/second');
}

function toThird(): void {
  void getRouter().push('/multi-menu/first/second-new/third');
}
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
