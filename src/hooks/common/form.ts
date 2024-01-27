import { ref } from 'vue';
import type { FormInst } from 'naive-ui';
import { REG_CODE_SIX, REG_EMAIL, REG_PHONE, REG_PWD, REG_USER_NAME } from '@/constants/reg';
import { $t } from '@/locales';

export function useFormRules() {
  const constantRules = {
    userName: [
      createRequiredRule($t('form.userName.required')),
      {
        pattern: REG_USER_NAME,
        message: $t('form.userName.invalid'),
        trigger: 'change'
      }
    ],
    phone: [
      createRequiredRule($t('form.phone.required')),
      {
        pattern: REG_PHONE,
        message: $t('form.phone.invalid'),
        trigger: 'change'
      }
    ],
    pwd: [
      createRequiredRule($t('form.pwd.required')),
      {
        pattern: REG_PWD,
        message: $t('form.pwd.invalid'),
        trigger: 'change'
      }
    ],
    code: [
      createRequiredRule($t('form.code.required')),
      {
        pattern: REG_CODE_SIX,
        message: $t('form.code.invalid'),
        trigger: 'change'
      }
    ],
    email: [
      createRequiredRule($t('form.email.required')),
      {
        pattern: REG_EMAIL,
        message: $t('form.email.invalid'),
        trigger: 'change'
      }
    ]
  } satisfies Record<string, App.Global.FormRule[]>;

  /** the default required rule */
  const defaultRequiredRule = createRequiredRule($t('form.required'));

  function createRequiredRule(message: string): App.Global.FormRule {
    return {
      required: true,
      message
    };
  }

  return {
    constantRules,
    defaultRequiredRule,
    createRequiredRule
  };
}

export function useNaiveForm() {
  const formRef = ref<FormInst | null>(null);

  async function validate() {
    await formRef.value?.validate();
  }

  return {
    formRef,
    validate
  };
}
