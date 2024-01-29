<script setup lang="tsx">
import { computed, reactive, watch } from 'vue';
import type { SelectOption } from 'naive-ui';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { enableStatusOptions, menuIconTypeOptions, menuTypeOptions } from '@/constants/business';
import SvgIcon from '@/components/custom/svg-icon.vue';
import { getLocalIcons } from '@/utils/icon';

defineOptions({
  name: 'MenuOperateDrawer'
});

/**
 * the type of operation
 *
 * - add: add user
 * - edit: edit user
 */
export type OperateType = 'add' | 'edit';

interface Props {
  /** the type of operation */
  operateType: OperateType;
  /** the edit row data */
  rowData?: Api.SystemManage.Menu | null;
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
    edit: $t('page.manage.menu.editMenu')
  };
  return titles[props.operateType];
});

type Model = Pick<
  Api.SystemManage.Menu,
  'menuType' | 'menuName' | 'icon' | 'iconType' | 'routeName' | 'routePath' | 'status' | 'hideInMenu' | 'order'
>;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    menuType: '1',
    menuName: '',
    icon: '',
    iconType: '1',
    routeName: '',
    routePath: '',
    status: null,
    hideInMenu: false,
    order: 0
  };
}

type RuleKey = Extract<keyof Model, 'userName' | 'userStatus'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  userName: defaultRequiredRule,
  userStatus: defaultRequiredRule
};

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

function handleUpdateModelWhenEdit() {
  if (props.operateType === 'add') {
    Object.assign(model, createDefaultModel());
    return;
  }

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model, props.rowData);
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  // request
  window.$message?.success($t('common.updateSuccess'));
  closeDrawer();
  emit('submitted');
}

watch(visible, () => {
  if (visible.value) {
    handleUpdateModelWhenEdit();
    restoreValidation();
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" :title="title" display-directive="show" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" :label-width="80">
        <NFormItem :label="$t('page.manage.menu.menuType')" path="menuType">
          <NRadioGroup v-model:value="model.menuType">
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
