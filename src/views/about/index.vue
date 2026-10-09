<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { SCard, SInput, STable, STag } from '@vean/ui';
import type { TableColumn } from '@vean/ui';
import { APP_VERSION } from '@/constants';
import { BUILD_TIME, DEPENDENCIES, DEPENDENCY_COUNT, PACKAGE_INFO } from './modules/dependencies';
import type { DependencyInfo } from './modules/dependencies';

defineOptions({ name: 'AboutPage' });

const { t } = useI18n();

/** 技术栈标签（静态清单：这里列的是「本项目实际用到的」，改动时同步维护） */
const TECH_STACK = [
  { name: 'Vue 3', desc: 'Composition API + `<script setup>`' },
  { name: 'TypeScript', desc: 'strict + 无 `any` / 无 `as` 断言' },
  { name: 'ubean', desc: 'Hono + Vite 全栈框架（文件式路由 / API / SSR）' },
  { name: 'Vean', desc: '`@vean/ui` + `@vean/aria` + `@vean/unocss`' },
  { name: 'UnoCSS', desc: '原子化样式，presetSoybean + presetUi' },
  { name: 'Pinia', desc: 'auth / menu / tab / theme / app' },
  { name: 'Vue Router 5', desc: '文件路由 + 全局守卫（静态 / 动态菜单）' },
  { name: 'vue-i18n', desc: 'zh / en 双语，URL 前缀策略' },
  { name: 'ECharts 6', desc: '按需注册，dashboard 图表' },
  { name: 'Valibot', desc: '前后端共享 schema（Standard Schema）' },
  { name: 'Drizzle + SQLite', desc: 'ORM + 本地文件库，服务端 seed' },
  { name: 'Vitest', desc: '纯逻辑单测 + 真实 HTTP 集成测试' }
];

/** 构建时间展示（ISO → 本地可读；解析失败则原样显示，不编造） */
const buildTimeText = computed(() => {
  const parsed = new Date(BUILD_TIME);

  if (Number.isNaN(parsed.getTime())) return BUILD_TIME;

  return parsed.toLocaleString();
});

const dependencyGroups = computed(() => [
  { value: 'all', label: t('page.about.depAll'), count: DEPENDENCY_COUNT.total },
  { value: 'dependencies', label: t('page.about.depRuntime'), count: DEPENDENCY_COUNT.production },
  { value: 'devDependencies', label: t('page.about.depDev'), count: DEPENDENCY_COUNT.development }
]);

const activeGroup = ref('all');
const keyword = ref('');

const allDependencies: DependencyInfo[] = DEPENDENCIES;

const filteredDependencies = computed(() => {
  const kw = keyword.value.trim().toLowerCase();

  return allDependencies.filter(item => {
    const groupMatched = activeGroup.value === 'all' || item.group === activeGroup.value;
    const keywordMatched = !kw || item.name.toLowerCase().includes(kw);

    return groupMatched && keywordMatched;
  });
});

const dependencyColumns = computed<TableColumn<DependencyInfo>[]>(() => [
  { accessorKey: 'name', header: t('page.about.depName'), minSize: 240 },
  { accessorKey: 'version', header: t('page.about.depVersion'), minSize: 160 },
  { accessorKey: 'group', header: t('page.about.depGroup'), minSize: 160 }
]);

function rowKey(row: DependencyInfo): string {
  return `${row.group}:${row.name}`;
}

function onGroupChange(value: string): void {
  activeGroup.value = value;
}

function groupLabel(group: string): string {
  return group === 'dependencies' ? t('page.about.depRuntime') : t('page.about.depDev');
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <SCard :title="t('page.about.project')">
      <div class="flex flex-col gap-4">
        <p class="text-sm opacity-70">{{ t('page.about.description') }}</p>

        <div class="grid gap-x-6 gap-y-3 cols-3 lt-lg:cols-2 lt-sm:cols-1">
          <div class="flex flex-col gap-1">
            <span class="text-xs opacity-60">{{ t('page.about.version') }}</span>
            <STag variant="soft" color="primary">{{ APP_VERSION }}</STag>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs opacity-60">{{ t('page.about.packageName') }}</span>
            <span class="text-sm font-500">{{ PACKAGE_INFO.name }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs opacity-60">{{ t('page.about.license') }}</span>
            <span class="text-sm font-500">{{ PACKAGE_INFO.license }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs opacity-60">{{ t('page.about.author') }}</span>
            <span class="text-sm font-500">{{ PACKAGE_INFO.author }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs opacity-60">{{ t('page.about.buildTime') }}</span>
            <span class="text-sm font-500">{{ buildTimeText }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs opacity-60">{{ t('page.about.homepage') }}</span>
            <a
              class="text-sm text-primary hover:underline"
              :href="PACKAGE_INFO.homepage"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ PACKAGE_INFO.homepage }}
            </a>
          </div>
        </div>
      </div>
    </SCard>

    <SCard :title="t('page.about.techStack')">
      <div class="grid gap-3 cols-4 lt-xl:cols-3 lt-md:cols-2 lt-sm:cols-1">
        <div
          v-for="item in TECH_STACK"
          :key="item.name"
          class="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
        >
          <div class="text-sm font-600">{{ item.name }}</div>
          <div class="mt-1 text-xs opacity-60">{{ item.desc }}</div>
        </div>
      </div>
    </SCard>

    <SCard :title="t('page.about.dependencies')">
      <template #extra>
        <div class="flex items-center gap-3">
          <SInput v-model="keyword" :placeholder="t('page.about.depSearchPlaceholder')" class="w-50" clearable />
          <STag
            v-for="group in dependencyGroups"
            :key="group.value"
            class="cursor-pointer select-none"
            :variant="activeGroup === group.value ? 'soft' : 'outline'"
            :color="activeGroup === group.value ? 'primary' : 'carbon'"
            @click="onGroupChange(group.value)"
          >
            {{ group.label }} ({{ group.count }})
          </STag>
        </div>
      </template>

      <STable :columns="dependencyColumns" :data="filteredDependencies" :row-key="rowKey" size="sm" class="max-h-150">
        <template #name="{ value }">
          <span class="text-sm">{{ value }}</span>
        </template>
        <template #version="{ value }">
          <span class="font-mono text-xs">{{ value }}</span>
        </template>
        <template #group="{ value }">
          <STag variant="outline" color="carbon">{{ groupLabel(value) }}</STag>
        </template>
        <template #empty>
          <span class="text-sm opacity-60">{{ t('page.about.depEmpty') }}</span>
        </template>
      </STable>
    </SCard>
  </div>
</template>
