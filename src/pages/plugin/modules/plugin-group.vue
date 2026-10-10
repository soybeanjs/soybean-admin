<script setup lang="ts">
import { SIcon, SLink } from '@vean/ui';
import { getRouter } from '@/router/instance';

/**
 * 分组落地页的公共列表（P4-01）。
 *
 * `/plugin/charts`、`/plugin/editor`、`/plugin/gantt` 三个分组页在侧栏里是父节点，
 * 点进去看到的只是「本组有哪些页」，结构完全一样 —— 收成一个组件。
 *
 * 文案由调用方传入 `t()` 的结果（本仓 `test/remove-i18n.test.ts` 禁动态 i18n key，
 * 子组件里不能再 `t(props.key)`）。
 */
interface PluginGroupLink {
  path: string;
  label: string;
  icon: string;
}

defineOptions({ name: 'PluginGroup' });

defineProps<{
  /** 分组说明（已本地化） */
  description: string;
  links: PluginGroupLink[];
}>();

const router = getRouter();

function go(path: string) {
  void router.push(path);
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <p class="text-sm opacity-70">{{ description }}</p>

    <div class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      <SLink
        v-for="link in links"
        :key="link.path"
        class="flex items-center gap-2 rounded-md border border-solid border-border px-3 py-2 hover:bg-muted"
        @click.prevent="go(link.path)"
      >
        <SIcon :icon="link.icon" class="shrink-0 text-lg" />
        <span class="truncate text-sm">{{ link.label }}</span>
      </SLink>
    </div>
  </div>
</template>
