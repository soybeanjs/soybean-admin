<template>
  <div
    class="drawer-shadow absolute-lt flex-col-stretch h-full overflow-hidden bg-white dark:bg-dark transition-width duration-300 ease-in-out"
    :style="{ width: showDrawer ? theme.menuStyle.width + 'px' : '0px' }"
  >
    <header class="header-height flex-y-center justify-between">
      <h2 class="text-primary pl-8px text-16px font-bold">{{ title }}</h2>
      <div class="px-8px text-16px text-gray-600 cursor-pointer" @click="toggleFixedMixMenu">
        <icon-mdi-pin-off v-if="app.menu.fixedMix" />
        <icon-mdi-pin v-else />
      </div>
    </header>
    <div class="flex-1-hidden">
      <n-scrollbar>
        <n-menu :value="activeKey" :options="childMenus" :indent="18" @update:value="handleUpdateMenu" />
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
import { useAppTitle } from '@/composables';
import { menus } from '@/router';
import type { GlobalMenuOption } from '@/interface';

interface Props {
  /** 菜单抽屉可见性 */
  visible?: boolean;
  /** 激活状态的路由名称 */
  activeRouteName: string;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false
});

const router = useRouter();
const route = useRoute();
const theme = useThemeStore();
const app = useAppStore();
const { toggleFixedMixMenu } = useAppStore();
const title = useAppTitle();

const childMenus = computed(() => {
  const children: MenuOption[] = [];
  menus.some(item => {
    const flag = item.routeName === props.activeRouteName && Boolean(item.children?.length);
    if (flag) {
      children.push(...item.children!);
    }
    return flag;
  });
  return children;
});

const showDrawer = computed(() => (props.visible && childMenus.value.length) || app.menu.fixedMix);

const activeKey = computed(() => route.name as string);

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
