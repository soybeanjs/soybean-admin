<template>
  <div
    class="
      drawer-shadow
      absolute-lt
      flex-col-stretch
      h-full
      overflow-hidden
      transition-width
      duration-300
      ease-in-out
      bg-white
      dark:bg-[#18181c]
    "
    :style="{ width: showDrawer ? theme.menuStyle.width + 'px' : '0px' }"
    @mouseleave="handleResetHoverRoute"
  >
    <header class="header-height flex-y-center justify-between">
      <h2 class="pl-8px text-16px text-primary font-bold">{{ title }}</h2>

      <div class="px-8px text-16px cursor-pointer" @click="toggleFixedMixMenu">
        <icon-mdi:pin-off v-if="app.menu.fixedMix" />
        <icon-mdi:pin v-else />
      </div>
    </header>
    <div class="flex-1-hidden">
      <n-scrollbar>
        <n-menu :value="activeKey" :options="childMenus" @update:value="handleUpdateMenu" />
      </n-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { NScrollbar, NMenu } from 'naive-ui';
import type { MenuOption } from 'naive-ui';
import { useThemeStore, useAppStore } from '@/store';
import { useAppTitle } from '@/hooks';
import { menus } from '@/router';
import type { GlobalMenuOption } from '@/interface';

const props = defineProps({
  hoverRoute: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['reset-hover-route']);

const router = useRouter();
const route = useRoute();
const theme = useThemeStore();
const app = useAppStore();
const { toggleFixedMixMenu } = useAppStore();
const title = useAppTitle();

const childMenus = computed(() => {
  const children: MenuOption[] = [];
  menus.some(item => {
    const flag = item.routeName === props.hoverRoute && Boolean(item.children?.length);
    if (flag) {
      children.push(...item.children!);
    }
    return flag;
  });
  return children;
});

const showDrawer = computed(() => childMenus.value.length || app.menu.fixedMix);

const activeKey = computed(() => getActiveKey());

function getActiveKey() {
  return route.name as string;
}

function handleResetHoverRoute() {
  emit('reset-hover-route');
}

function handleUpdateMenu(key: string, item: MenuOption) {
  const menuItem = item as GlobalMenuOption;
  router.push(menuItem.routePath);
}

const headerHeight = computed(() => {
  const { height } = theme.headerStyle;
  return `${height}px`;
});
</script>
<style scoped>
.drawer-shadow {
  box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
}
.header-height {
  height: v-bind(headerHeight);
}
</style>
