<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { SButton, SDialog, SForm, SInput, SInputNumber, SSelect, STextarea, toast, useForm } from '@vean/ui';
import { MENU_CHILD_TYPES, MANAGE_MENU_TYPES } from '@/constants/manage';
import type { ManageMenuType } from '@/constants/manage';
import { createMenu, fetchMenuById, updateMenu } from '@/service/api/menu-manage';
import type { MenuRow } from '@/service/api/menu-manage';
import { useManageOptions } from '@/composables/use-manage-options';
import { menuFormSchema } from '@/schema/form';
import type { MenuFormDTO } from '@/schema/form';
import { emptyMenuForm, toMenuForm } from '@/schema/form-defaults';
import type { MenuCreateDTO } from '@/schema/menu';
import RouteParamForm from './route-param-form.vue';

/**
 * 菜单新增 / 编辑弹窗（P3-03）。
 *
 * 菜单类型决定字段可见性与提交内容，参照 unify 的 `clearFieldsByMenuType`：
 * 切换类型时把不适用字段清空，避免脏数据进入后端（后端
 * `src/services/menu.service.ts` 的 `validateMenuTypeConstraints` 会拒绝）。
 *
 * `menuType` / `routePath` / `routeQueries` / `routeParams` 都从
 * `form.useSelector` 读（`form.state` 是 TanStack Store 快照，无 Vue 响应性）。
 */
defineOptions({ name: 'MenuOperate' });

const props = defineProps<{
  /** 正在编辑的菜单 id；`undefined` 表示为新增 */
  menuId?: string;
  /** 全量菜单（父级选择器与组件名候选） */
  menus: MenuRow[];
}>();

const emit = defineEmits<{
  success: [];
}>();

const open = defineModel<boolean>('open', { required: true });

const { t } = useI18n();
const { enabledOptions, yesOrNoOptions, menuTypeOptions } = useManageOptions();

const loading = ref(false);
/** 编辑态：当前菜单是重定向路由（后端 `routeRedirect` 非空） */
const isRedirectRoute = shallowRef(false);

const title = computed(() => (props.menuId ? t('manage.editTitle') : t('manage.addTitle')));

const { SFormField, form, handleSubmit, handleReset } = useForm({
  schema: menuFormSchema,
  defaultValues: emptyMenuForm,
  onSubmit: async values => {
    await submit(values);
  }
});

const menuType = form.useSelector(state => state.values.menuType);
const routePath = form.useSelector(state => state.values.routePath);
const routeQueries = form.useSelector(state => state.values.routeQueries);
const routeParams = form.useSelector(state => state.values.routeParams);

const isRoute = computed(() => menuType.value === 'menu' || menuType.value === 'page' || menuType.value === 'iframe');
const isIframe = computed(() => menuType.value === 'iframe');
const isDefaultRoute = computed(() => isRoute.value && !isIframe.value);
const isLink = computed(() => menuType.value === 'link');
const isParamRoute = computed(() => isDefaultRoute.value && (routePath.value ?? '').includes(':'));

/** 当前类型允许的父级类型（后端 `validateParent` 的反向推导） */
const enabledParentMenuTypes = computed<readonly string[]>(() => {
  const target = menuType.value;

  if (!target) {
    return ['directory'];
  }

  const allowed = MANAGE_MENU_TYPES.filter(parent => childTypesOf(parent).includes(target));

  return allowed.length ? allowed : ['directory'];
});

const parentOptions = computed(() =>
  props.menus
    .filter(menu => menu.id !== props.menuId && enabledParentMenuTypes.value.includes(menu.menuType))
    .map(menu => ({ value: menu.id, label: menu.name }))
);

const componentOptions = computed(() =>
  props.menus
    .filter(menu => (menu.menuType === 'menu' || menu.menuType === 'page') && menu.routeComponent)
    .map(menu => ({ value: menu.routeComponent ?? '', label: menu.routeComponent ?? '' }))
);

function childTypesOf(parent: ManageMenuType): readonly string[] {
  return MENU_CHILD_TYPES[parent];
}

function nullable(value: string): string | null {
  return value ? value : null;
}

/** 切换菜单类型时清空不适用字段（后端会拒绝类型与字段不匹配的请求） */
function clearFieldsByMenuType(type: ManageMenuType | undefined) {
  if (type === 'menu' || type === 'page') {
    form.setFieldValue('iframeUrl', '');
    form.setFieldValue('href', '');
    return;
  }

  if (type === 'iframe') {
    form.setFieldValue('href', '');
    clearRouteFields();
    return;
  }

  if (type === 'link') {
    form.setFieldValue('iframeUrl', '');
    clearRouteFields();
    clearRouteToggles();
    return;
  }

  form.setFieldValue('iframeUrl', '');
  form.setFieldValue('href', '');
  clearRouteFields();
  clearRouteToggles();
}

function clearRouteFields() {
  form.setFieldValue('routeName', '');
  form.setFieldValue('routePath', '');
  form.setFieldValue('routeLayout', '');
  form.setFieldValue('routeComponent', '');
  form.setFieldValue('routeRedirect', '');
  form.setFieldValue('routeParams', {});
  form.setFieldValue('routeQueries', {});
}

function clearRouteToggles() {
  form.setFieldValue('keepAlive', 'N');
  form.setFieldValue('multiTab', 'N');
  form.setFieldValue('pinned', 'N');
}

function buildBody(values: MenuFormDTO): MenuCreateDTO {
  return {
    parentId: values.parentId,
    menuType: values.menuType,
    name: values.name,
    code: values.code,
    requiresAuth: values.requiresAuth,
    icon: nullable(values.icon),
    i18nKey: nullable(values.i18nKey),
    order: values.order,
    iframeUrl: nullable(values.iframeUrl),
    href: nullable(values.href),
    keepAlive: values.keepAlive,
    multiTab: values.multiTab,
    pinned: values.pinned,
    routeName: nullable(values.routeName),
    routePath: nullable(values.routePath),
    routeLayout: nullable(values.routeLayout),
    routeComponent: nullable(values.routeComponent),
    routeRedirect: nullable(values.routeRedirect),
    routeQueries: values.routeQueries,
    routeParams: values.routeParams
  };
}

async function submit(values: MenuFormDTO): Promise<void> {
  loading.value = true;

  try {
    const body = buildBody(values);

    if (props.menuId) {
      await updateMenu(props.menuId, body);
    } else {
      await createMenu(body);
    }

    open.value = false;

    if (props.menuId) {
      toast.success(t('manage.updateSuccess'));
    } else {
      toast.success(t('manage.createSuccess'));
    }

    emit('success');
  } finally {
    loading.value = false;
  }
}

async function initForm(id: string | undefined): Promise<void> {
  if (!id) {
    isRedirectRoute.value = false;
    handleReset();
    return;
  }

  loading.value = true;

  try {
    const row = await fetchMenuById(id);

    isRedirectRoute.value = Boolean(row.routeRedirect);
    form.reset(toMenuForm(row));
  } finally {
    loading.value = false;
  }
}

function onRouteQueriesUpdate(value: Record<string, string>) {
  form.setFieldValue('routeQueries', value);
}

function onRouteParamsUpdate(value: Record<string, string>) {
  form.setFieldValue('routeParams', value);
}

watch(menuType, value => {
  clearFieldsByMenuType(value);
});

watch(routePath, () => {
  if (!isParamRoute.value) {
    form.setFieldValue('routeParams', {});
  }
});

watch(
  [open, () => props.menuId],
  () => {
    if (open.value) {
      void initForm(props.menuId);
    }
  },
  { immediate: true }
);
</script>

<template>
  <SDialog v-model:open="open" :title="title" class="max-w-6xl">
    <SForm class="grid max-h-100 grid-cols-3 gap-x-4 gap-y-6 overflow-y-auto p-2" @submit.prevent="handleSubmit">
      <SFormField name="enabled" :label="t('manage.field.enabled')">
        <SSelect :items="enabledOptions" />
      </SFormField>

      <SFormField name="menuType" :label="t('manage.menu.menuType')">
        <SSelect :items="menuTypeOptions" />
      </SFormField>

      <SFormField name="parentId" :label="t('manage.field.parentId')">
        <SSelect :items="parentOptions" />
      </SFormField>

      <SFormField name="name" :label="t('manage.menu.name')">
        <SInput :placeholder="t('manage.menu.name')" />
      </SFormField>

      <SFormField name="code" :label="t('manage.menu.code')">
        <SInput :placeholder="t('manage.menu.code')" />
      </SFormField>

      <SFormField name="order" :label="t('manage.field.order')">
        <SInputNumber />
      </SFormField>

      <SFormField name="icon" :label="t('manage.menu.icon')">
        <SInput :placeholder="t('manage.menu.icon')" />
      </SFormField>

      <SFormField name="i18nKey" :label="t('manage.menu.i18nKey')">
        <SInput :placeholder="t('manage.menu.i18nKey')" />
      </SFormField>

      <SFormField name="requiresAuth" :label="t('manage.menu.requiresAuth')">
        <SSelect :items="yesOrNoOptions" />
      </SFormField>

      <template v-if="isDefaultRoute">
        <SFormField name="routePath" :label="t('manage.menu.routePath')">
          <SInput :placeholder="t('manage.menu.routePath')" />
        </SFormField>

        <SFormField name="routeName" :label="t('manage.menu.routeName')">
          <SInput :placeholder="t('manage.menu.routeName')" />
        </SFormField>

        <SFormField v-if="isRedirectRoute" name="routeRedirect" :label="t('manage.menu.routeRedirect')">
          <SInput :placeholder="t('manage.menu.routeRedirect')" />
        </SFormField>

        <template v-else>
          <SFormField name="routeLayout" :label="t('manage.menu.routeLayout')">
            <SInput :placeholder="t('manage.menu.routeLayout')" />
          </SFormField>

          <SFormField name="routeComponent" :label="t('manage.menu.routeComponent')">
            <SSelect :items="componentOptions" />
          </SFormField>
        </template>
      </template>

      <SFormField v-if="isIframe" name="iframeUrl" :label="t('manage.menu.iframeUrl')">
        <SInput :placeholder="t('manage.menu.iframeUrl')" />
      </SFormField>

      <SFormField v-if="isLink" name="href" :label="t('manage.menu.href')">
        <SInput :placeholder="t('manage.menu.href')" />
      </SFormField>

      <SFormField v-if="isDefaultRoute" name="keepAlive" :label="t('manage.menu.keepAlive')">
        <SSelect :items="yesOrNoOptions" />
      </SFormField>

      <SFormField v-if="isDefaultRoute" name="multiTab" :label="t('manage.menu.multiTab')">
        <SSelect :items="yesOrNoOptions" />
      </SFormField>

      <SFormField v-if="isRoute" name="pinned" :label="t('manage.menu.pinned')">
        <SSelect :items="yesOrNoOptions" />
      </SFormField>

      <SFormField
        v-if="isRoute"
        name="routeParams"
        :label="t('manage.menu.routeParams')"
        class="col-span-3 items-start lt-xl:col-span-2 lt-md:col-span-1"
      >
        <RouteParamForm
          :model-value="routeParams ?? {}"
          :add-label="t('manage.menu.addParam')"
          @update:model-value="onRouteParamsUpdate"
        />
      </SFormField>

      <SFormField
        v-if="isRoute"
        name="routeQueries"
        :label="t('manage.menu.routeQueries')"
        class="col-span-3 items-start lt-xl:col-span-2 lt-md:col-span-1"
      >
        <RouteParamForm
          :model-value="routeQueries ?? {}"
          :add-label="t('manage.menu.addQuery')"
          @update:model-value="onRouteQueriesUpdate"
        />
      </SFormField>

      <SFormField
        name="description"
        :label="t('manage.field.description')"
        class="col-span-3 lt-xl:col-span-2 lt-md:col-span-1"
      >
        <STextarea :placeholder="t('manage.field.description')" />
      </SFormField>
    </SForm>

    <template #footer>
      <SButton variant="outline" @click="open = false">{{ t('common.cancel') }}</SButton>
      <SButton :loading="loading" @click="handleSubmit">{{ t('common.confirm') }}</SButton>
    </template>
  </SDialog>
</template>
