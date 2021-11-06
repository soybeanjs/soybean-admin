<template>
  <n-breadcrumb class="px-12px">
    <template v-for="breadcrumb in breadcrumbList" :key="breadcrumb.key">
      <n-breadcrumb-item>
        <n-dropdown v-if="breadcrumb.hasChildren" :options="breadcrumb.children" @select="dropdownSelect">
          <span>{{ breadcrumb.label }}</span>
        </n-dropdown>
        <span v-else>{{ breadcrumb.label }}</span>
      </n-breadcrumb-item>
    </template>
  </n-breadcrumb>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NBreadcrumb, NBreadcrumbItem, NDropdown } from 'naive-ui';
import type { DropdownOption } from 'naive-ui';
import type { RouteLocationMatched } from 'vue-router';
import { EnumRoutePath } from '@/enum';
import type { RoutePathKey } from '@/interface';

type Breadcrumb = DropdownOption & {
  key: string;
  label: string;
  disabled: boolean;
  routeName: RoutePathKey;
  hasChildren: boolean;
  children?: Breadcrumb[];
};

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
    if (!item.meta?.isNotMenu) {
      const routeName = item.name as RoutePathKey;
      const breadcrumItem: Breadcrumb = {
        key: routeName,
        label: (item.meta?.title as string) || '',
        disabled: item.path === EnumRoutePath.root,
        routeName,
        hasChildren: false
      };
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
  const key = optionKey as RoutePathKey;
  router.push({ name: key });
}
</script>
<style scoped></style>
