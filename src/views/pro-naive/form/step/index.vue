<script setup lang="ts">
import { ref } from 'vue';
import { useMessage } from 'naive-ui';
import { createProForm } from 'pro-naive-ui';
import { $t } from '@/locales';
import ConfigProvider from '../../ConfigProvider.vue';

const step = ref(1);
const submiting = ref(false);
const message = useMessage();
const form = createProForm();

const form2 = createProForm({
  onSubmit: async values => {
    submiting.value = true;
    await delay(1000);
    message.success(
      JSON.stringify({
        ...form.values.value,
        ...values
      })
    );
    submiting.value = false;
  }
});

function toNextStepAfterValidated() {
  form.validate()?.then(() => {
    step.value += 1;
  });
}

function delay(time: number) {
  return new Promise<void>(resolve => {
    setTimeout(resolve, time);
  });
}
</script>

<template>
  <ConfigProvider>
    <div class="color-#fff">
      <ProCard :title="$t('page.proNaive.form.step.title')" :segmented="{ content: true }" :show-collapse="false">
        <div class="flex flex-col items-center justify-center">
          <NSteps :current="step" class="mb-50px ml-200px w-60%">
            <NStep :title="$t('page.proNaive.form.step.step1.title')" />
            <NStep :title="$t('page.proNaive.form.step.step2.title')" />
          </NSteps>
          <template v-if="step === 1">
            <ProForm :form="form" label-placement="left">
              <ProInput :title="$t('page.proNaive.form.step.step1.field')" path="form1Field" required />
              <NButton @click="toNextStepAfterValidated">{{ $t('page.proNaive.form.step.step1.nextStep') }}</NButton>
            </ProForm>
          </template>
          <template v-if="step === 2">
            <ProForm :form="form2" :loading="submiting" label-placement="left">
              <ProInput :title="$t('page.proNaive.form.step.step2.field')" path="form2Field" required />
              <NFlex>
                <NButton :disabled="submiting" @click="step -= 1">
                  {{ $t('page.proNaive.form.step.step2.prevStep') }}
                </NButton>
                <NButton type="primary" attr-type="submit" :loading="submiting">
                  {{ $t('page.proNaive.form.step.step2.submit') }}
                </NButton>
              </NFlex>
            </ProForm>
          </template>
        </div>
      </ProCard>
    </div>
  </ConfigProvider>
</template>
