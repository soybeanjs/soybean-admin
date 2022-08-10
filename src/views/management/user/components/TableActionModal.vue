<template>
  <n-modal v-model:show="modalVisible" preset="card" :title="title" class="w-700px">
    <n-form label-placement="left" :label-width="80" :model="formModel">
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="12" label="用户名" path="userName">
          <n-input v-model:value="formModel.userName" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="年龄" path="userAge">
          <n-input v-model:value="formModel.userAge" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="性别" path="userGender">
          <n-input v-model:value="formModel.userGender" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="手机号" path="userPhone">
          <n-input v-model:value="formModel.userPhone" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="邮箱" path="userEmail">
          <n-input v-model:value="formModel.userEmail" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="角色" path="userRole">
          <n-input v-model:value="formModel.userRole" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="状态" path="disabled">
          <n-switch v-model:value="formModel.disabled" />
        </n-form-item-grid-item>
      </n-grid>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';

defineOptions({ name: 'TableActionModal' });

type ModalType = 'add' | 'edit';

interface Props {
  /** 弹窗可见性 */
  visible: boolean;
  /** 弹窗类型 */
  type?: ModalType;
  /** 编辑的表格行数据 */
  editData?: UserManagement.UserTable | null;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
  editData: null
});

interface Emits {
  (e: 'update:visible', visible: boolean): void;
}

const emit = defineEmits<Emits>();

const modalVisible = computed({
  get() {
    return props.visible;
  },
  set(visible) {
    emit('update:visible', visible);
  }
});

const title = computed(() => {
  const titles: Record<ModalType, string> = {
    add: '添加用户',
    edit: '编辑用户'
  };
  return titles[props.type];
});

type FormModel = Pick<
  UserManagement.UserTable,
  'userName' | 'userAge' | 'userGender' | 'userPhone' | 'userEmail' | 'userRole' | 'disabled'
>;

const formModel = reactive<FormModel>(createDefaultFormModel());

function createDefaultFormModel(): FormModel {
  return {
    userName: '',
    userAge: '',
    userGender: 'null',
    userPhone: '',
    userEmail: '',
    userRole: 'user',
    disabled: true
  };
}

function handleUpdateFormModel(model: Partial<FormModel>) {
  Object.assign(formModel, model);
}

function handleUpdateFormModelByModalType() {
  const handlers: Record<ModalType, () => void> = {
    add: () => {
      const defaultFormModel = createDefaultFormModel();
      handleUpdateFormModel(defaultFormModel);
    },
    edit: () => {
      if (props.editData) {
        handleUpdateFormModel(props.editData);
      }
    }
  };

  handlers[props.type]();
}

watch(
  () => props.visible,
  newValue => {
    if (newValue) {
      handleUpdateFormModelByModalType();
    }
  }
);
</script>

<style scoped></style>
