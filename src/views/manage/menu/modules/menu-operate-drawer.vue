<script setup lang="tsx">
import { computed, reactive, watch } from 'vue';
import type { SelectOption } from 'naive-ui';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { enableStatusOptions, menuIconTypeOptions, menuTypeOptions } from '@/constants/business';
import SvgIcon from '@/components/custom/svg-icon.vue';
import { getLocalIcons } from '@/utils/icon';
import { getLayoutAndPage, transformLayoutAndPageToComponent } from './shared';

defineOptions({
  name: 'MenuOperateDrawer'
});

export type OperateType = NaiveUI.TableOperateType | 'addChild';

interface Props {
  /** the type of operation */
  operateType: OperateType;
  /** the edit menu data or the parent menu data when adding a child menu */
  rowData?: Api.SystemManage.Menu | null;
  /** all pages */
  allPages: string[];
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<OperateType, string> = {
    add: $t('page.manage.menu.addMenu'),
    addChild: $t('page.manage.menu.addChildMenu'),
    edit: $t('page.manage.menu.editMenu')
  };
  return titles[props.operateType];
});

type Model = Pick<
  Api.SystemManage.Menu,
  | 'menuType'
  | 'menuName'
  | 'icon'
  | 'iconType'
  | 'routeName'
  | 'routePath'
  | 'component'
  | 'status'
  | 'hideInMenu'
  | 'order'
  | 'parentId'
> & {
  layout: string;
  page: string;
};

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    menuType: '1',
    menuName: '',
    icon: '',
    iconType: '1',
    routeName: '',
    routePath: '',
    layout: '',
    page: '',
    status: null,
    hideInMenu: false,
    order: 0,
    parentId: 0
  };
}

type RuleKey = Extract<keyof Model, 'userName' | 'userStatus'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  userName: defaultRequiredRule,
  userStatus: defaultRequiredRule
};

const disabledMenuType = computed(() => props.operateType === 'edit');

const localIcons = getLocalIcons();
const localIconOptions = localIcons.map<SelectOption>(item => ({
  label: () => (
    <div class="flex-y-center gap-16px">
      <SvgIcon localIcon={item} class="text-icon" />
      <span>{item}</span>
    </div>
  ),
  value: item
}));

const showLayout = computed(() => model.parentId === 0);

const showPage = computed(() => model.menuType === '2');

const pageOptions = computed(() => {
  const allPages = [...props.allPages];

  if (model.routeName && !allPages.includes(model.routeName)) {
    allPages.unshift(model.routeName);
  }

  const opts: CommonType.Option[] = allPages.map(page => ({
    label: page,
    value: page
  }));

  return opts;
});

const layoutOptions: CommonType.Option[] = [
  {
    label: 'base',
    value: 'base'
  },
  {
    label: 'blank',
    value: 'blank'
  }
];

function handleUpdateModel() {
  if (props.operateType === 'add') {
    Object.assign(model, createDefaultModel());

    return;
  }

  if (props.operateType === 'addChild' && props.rowData) {
    const { id } = props.rowData;

    Object.assign(model, createDefaultModel(), { parentId: id });
  }

  if (props.operateType === 'edit' && props.rowData) {
    const { component, ...rest } = props.rowData;

    const { layout, page } = getLayoutAndPage(component);

    Object.assign(model, rest, { layout, page });
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();

  model.component = transformLayoutAndPageToComponent(model.layout, model.page);

  // request
  window.$message?.success($t('common.updateSuccess'));
  closeDrawer();
  emit('submitted');
}

watch(visible, () => {
  if (visible.value) {
    handleUpdateModel();
    restoreValidation();
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" :title="title" display-directive="show" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" :label-width="80">
        <NFormItem :label="$t('page.manage.menu.menuType')" path="menuType">
          <NRadioGroup v-model:value="model.menuType" :disabled="disabledMenuType">
            <NRadio v-for="item in menuTypeOptions" :key="item.value" :value="item.value" :label="$t(item.label)" />
          </NRadioGroup>
        </NFormItem>
        <NFormItem :label="$t('page.manage.menu.menuName')" path="menuName">
          <NInput v-model:value="model.menuName" :placeholder="$t('page.manage.menu.form.menuName')" />
        </NFormItem>
        <NFormItem :label="$t('page.manage.menu.iconTypeTitle')" path="iconType">
          <NRadioGroup v-model:value="model.iconType">
            <NRadio v-for="item in menuIconTypeOptions" :key="item.value" :value="item.value" :label="$t(item.label)" />
          </NRadioGroup>
        </NFormItem>
        <NFormItem :label="$t('page.manage.menu.icon')" path="icon">
          <template v-if="model.iconType === '1'">
            <NInput v-model:value="model.icon" :placeholder="$t('page.manage.menu.form.icon')" class="flex-1">
              <template #suffix>
                <SvgIcon v-if="model.icon" :icon="model.icon" class="text-icon" />
              </template>
            </NInput>
          </template>
          <template v-if="model.iconType === '2'">
            <NSelect
              v-model:value="model.icon"
              :placeholder="$t('page.manage.menu.form.localIcon')"
              :options="localIconOptions"
            />
          </template>
        </NFormItem>
        <NFormItem :label="$t('page.manage.menu.routeName')" path="routeName">
          <NInput v-model:value="model.routeName" :placeholder="$t('page.manage.menu.form.routeName')" />
        </NFormItem>
        <NFormItem :label="$t('page.manage.menu.routePath')" path="routePath">
          <NInput v-model:value="model.routePath" :placeholder="$t('page.manage.menu.form.routePath')" />
        </NFormItem>
        <NFormItem v-if="showLayout" :label="$t('page.manage.menu.layout')" path="layout">
          <NSelect
            v-model:value="model.layout"
            :options="layoutOptions"
            :placeholder="$t('page.manage.menu.form.layout')"
          />
        </NFormItem>
        <NFormItem v-if="showPage" :label="$t('page.manage.menu.page')" path="page">
          <NSelect v-model:value="model.page" :options="pageOptions" :placeholder="$t('page.manage.menu.form.page')" />
        </NFormItem>
        <NFormItem :label="$t('page.manage.menu.menuStatus')" path="status">
          <NRadioGroup v-model:value="model.status">
            <NRadio v-for="item in enableStatusOptions" :key="item.value" :value="item.value" :label="$t(item.label)" />
          </NRadioGroup>
        </NFormItem>
        <NFormItem :label="$t('page.manage.menu.hideInMenu')" path="hideInMenu">
          <NRadioGroup v-model:value="model.hideInMenu">
            <NRadio value :label="$t('common.yesOrNo.yes')" />
            <NRadio :value="false" :label="$t('common.yesOrNo.no')" />
          </NRadioGroup>
        </NFormItem>
        <NFormItem :label="$t('page.manage.menu.order')" path="order">
          <NInputNumber v-model:value="model.order" :placeholder="$t('page.manage.menu.form.order')" />
        </NFormItem>
      </NForm>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
