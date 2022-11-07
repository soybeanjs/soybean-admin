<template>
  <n-breadcrumb class="px-12px">
    <template v-for="breadcrumb in breadcrumbs" :key="breadcrumb.key">
      <n-breadcrumb-item>
        <n-dropdown v-if="breadcrumb.hasChildren" :options="breadcrumb.children" @select="dropdownSelect">
          <span>
            <component
              :is="breadcrumb.icon"
              v-if="theme.header.crumb.showIcon"
              class="inline-block align-text-bottom mr-4px text-16px"
            />
            <span>{{ breadcrumb.label }}</span>
          </span>
        </n-dropdown>
        <template v-else>
          <component
            :is="breadcrumb.icon"
            v-if="theme.header.crumb.showIcon"
            class="inline-block align-text-bottom mr-4px text-16px"
            :class="{ 'text-#BBBBBB': theme.header.inverted }"
          />
          <span :class="{ 'text-#BBBBBB': theme.header.inverted }">{{ breadcrumb.label }}</span>
        </template>
      </n-breadcrumb-item>
    </template>
  </n-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { routePath } from '@/router';
import { useRouteStore, useThemeStore } from '@/store';
import { useRouterPush } from '@/composables';
import { getBreadcrumbByRouteKey } from '@/utils';

defineOptions({ name: 'GlobalBreadcrumb' });

const route = useRoute();
const theme = useThemeStore();
const routeStore = useRouteStore();
const { routerPush } = useRouterPush();

const breadcrumbs = computed(() =>
  getBreadcrumbByRouteKey(route.name as string, routeStore.menus as App.GlobalMenuOption[], routePath('root'))
);

function dropdownSelect(key: string) {
  routerPush({ name: key });
}
</script>

<style scoped></style>
