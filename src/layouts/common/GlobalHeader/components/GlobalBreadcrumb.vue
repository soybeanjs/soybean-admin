<template>
  <n-breadcrumb class="px-12px">
    <template v-for="breadcrumb in breadcrumbList" :key="breadcrumb.key">
      <n-breadcrumb-item>
        <n-dropdown v-if="breadcrumb.hasChildren" :options="breadcrumb.children" @select="dropdownSelect">
          <span>
            <Icon
              v-if="theme.crumbsStyle.showIcon && breadcrumb.iconName"
              :icon="breadcrumb.iconName"
              class="inline-block mr-4px text-16px"
            />
            <span>{{ breadcrumb.label }}</span>
          </span>
        </n-dropdown>
        <template v-else>
          <Icon
            v-if="theme.crumbsStyle.showIcon && breadcrumb.iconName"
            :icon="breadcrumb.iconName"
            class="inline-block mr-4px text-16px"
          />
          <span>{{ breadcrumb.label }}</span>
        </template>
      </n-breadcrumb-item>
    </template>
  </n-breadcrumb>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { RouteLocationMatched } from 'vue-router';
import { NBreadcrumb, NBreadcrumbItem, NDropdown } from 'naive-ui';
import type { DropdownOption } from 'naive-ui';
import { Icon } from '@iconify/vue';
import { routePath } from '@/router';
import { useThemeStore } from '@/store';
import type { RouteKey } from '@/interface';

type Breadcrumb = DropdownOption & {
  key: string;
  label: string;
  disabled: boolean;
  routeName: RouteKey;
  hasChildren: boolean;
  iconName?: string;
  children?: Breadcrumb[];
};

const theme = useThemeStore();
const route = useRoute();
const router = useRouter();

const breadcrumbList = computed<Breadcrumb[]>(() => generateBreadcrumb());

function generateBreadcrumb() {
  const { matched } = route;
  return recursionBreadcrumb(matched);
}

/** 递归匹配路由获取面包屑数据 */
function recursionBreadcrumb(routeMatched: RouteLocationMatched[]) {
  const list: Breadcrumb[] = [];
  routeMatched.forEach(item => {
    if (!item.meta?.notAsMenu) {
      const routeName = item.name as RouteKey;
      const breadcrumItem: Breadcrumb = {
        key: routeName,
        label: (item.meta?.title as string) || '',
        disabled: item.path === routePath('root'),
        routeName,
        hasChildren: false
      };
      if (item.meta?.icon) {
        breadcrumItem.iconName = item.meta.icon as string;
      }
      if (item.children && item.children.length) {
        breadcrumItem.hasChildren = true;
        breadcrumItem.children = recursionBreadcrumb(item.children as RouteLocationMatched[]);
      }
      list.push(breadcrumItem);
    }
  });
  return list;
}

function dropdownSelect(optionKey: string) {
  const key = optionKey as RouteKey;
  router.push({ name: key });
}
</script>
<style scoped></style>
