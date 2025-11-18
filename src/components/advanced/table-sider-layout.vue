<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';

defineOptions({
  name: 'TableSiderLayout'
});

interface Props {
  defaultExpanded?: boolean;
  siderTitle?: string;
}

withDefaults(defineProps<Props>(), {
  defaultExpanded: false,
  siderTitle: undefined
});

const time = new Date().getTime();
const breakpoints = useBreakpoints(breakpointsTailwind);
const isCollapse = breakpoints.smaller('lg');
</script>

<template>
  <NGrid
    v-if="isCollapse"
    class="min-h-500px flex-col-stretch gap-16px overflow-auto"
    :x-gap="12"
    :y-gap="12"
    item-responsive
    responsive="screen"
  >
    <NGridItem span="24 s:24 1034:10 m:8 l:7 xl:6 xxl:5">
      <NCard
        :bordered="false"
        size="small"
        class="sider-layout-card h-full card-wrapper"
        content-class="sider-layout-card-content"
      >
        <NCollapse v-if="isCollapse" :default-expanded-names="defaultExpanded ? [`table-sider-layout${time}`] : []">
          <NCollapseItem :title="siderTitle" :name="`table-sider-layout${time}`" display-directive="show">
            <slot name="sider" />
            <template #header>
              <slot name="header">
                <span>{{ siderTitle }}</span>
              </slot>
            </template>
            <template #header-extra>
              <slot name="header-extra" />
            </template>
          </NCollapseItem>
        </NCollapse>
      </NCard>
    </NGridItem>
    <NGridItem class="content" span="24 s:24 m:16 l:17 xl:18 xxl:19">
      <slot />
    </NGridItem>
  </NGrid>
  <NLayout v-else has-sider>
    <NLayoutSider collapse-mode="transform" :collapsed-width="0" :width="320" show-trigger="bar">
      <NCard
        :bordered="false"
        size="small"
        class="sider-layout-card h-full card-wrapper"
        content-class="sider-layout-card-content"
      >
        <slot name="sider" />
        <template #header>
          <slot name="header">
            <span>{{ siderTitle }}</span>
          </slot>
        </template>
        <template #header-extra>
          <slot name="header-extra" />
        </template>
      </NCard>
    </NLayoutSider>
    <NLayoutContent content-class="bg-transparent">
      <slot />
    </NLayoutContent>
  </NLayout>
</template>

<style scoped>
.title {
  font-weight: 500;
  font-size: 16px;
  transition: color 0.3s var(--n-bezier);
  flex: 1;
  min-width: 0;
  color: var(--n-title-text-color);
}

.content {
  min-height: calc(100vh - 196px - var(--calc-footer-height, 0px));
}

:deep(.n-collapse-item__header) {
  padding-top: 0 !important;
}

:deep(.n-layout-content) {
  background-color: transparent;
  padding-left: 25px;
}

:deep(.n-layout-sider) {
  background-color: transparent;
}
</style>
