<script setup lang="tsx">
import { computed, ref } from 'vue';
import { NButton, NFlex, useMessage } from 'naive-ui';
import type { ProEditDataTableColumns } from 'pro-naive-ui';
import { createProForm } from 'pro-naive-ui';
import { $t } from '@/locales';
import ConfigProvider from '../../ConfigProvider.vue';

interface DataSourceType {
  id: string;
  title?: string;
  now?: number;
  rate?: number;
}

const message = useMessage();
const editableKeys = ref<string[]>([]);

const form = createProForm({
  initialValues: {
    list: [
      {
        id: '1',
        now: Date.now(),
        rate: 4,
        title: `${$t('page.proNaive.table.rowEdit.task')}1`
      },
      {
        id: '2',
        now: Date.now(),
        rate: 3,
        title: `${$t('page.proNaive.table.rowEdit.task')}2`
      },
      {
        id: '3',
        now: Date.now(),
        rate: 5,
        title: `${$t('page.proNaive.table.rowEdit.task')}3`
      }
    ]
  },
  onSubmit: values => {
    message.success(JSON.stringify(values));
  }
});

function cancelEditable(id: string) {
  editableKeys.value = editableKeys.value.filter(key => key !== id);
}

const columns = computed<ProEditDataTableColumns<DataSourceType>>(() => {
  return [
    {
      title: $t('page.proNaive.table.rowEdit.name'),
      path: 'title',
      field: 'input',
      width: 200
    },
    {
      title: $t('page.proNaive.table.rowEdit.time'),
      path: 'now',
      field: 'date-time',
      width: 200
    },
    {
      title: $t('page.proNaive.table.rowEdit.score'),
      path: 'rate',
      field: 'rate'
    },
    {
      title: $t('page.proNaive.table.rowEdit.action'),
      width: 120,
      fixed: 'right',
      render: (row, rowIndex, { remove, editable }) => {
        return (
          <NFlex>
            {editable ? (
              <NButton text={true} type="primary" onClick={() => cancelEditable(row.id)}>
                {$t('page.proNaive.table.rowEdit.save')}
              </NButton>
            ) : (
              [
                <NButton text={true} type="primary" onClick={() => editableKeys.value.push(row.id)}>
                  {$t('page.proNaive.table.rowEdit.edit')}
                </NButton>,
                <NButton
                  text={true}
                  type="error"
                  onClick={() => {
                    remove(rowIndex);
                    cancelEditable(row.id);
                  }}
                >
                  {$t('page.proNaive.table.rowEdit.delete')}
                </NButton>
              ]
            )}
          </NFlex>
        );
      }
    }
  ];
});
</script>

<template>
  <ConfigProvider>
    <ProForm :form="form" label-placement="left">
      <ProConfigProvider
        :prop-overrides="{
          ProFormItem: {
            showFeedback: false
          }
        }"
      >
        <ProEditDataTable
          v-model:editable-keys="editableKeys"
          path="list"
          :columns="columns"
          :record-creator-props="{
            record: () => ({ id: Date.now() })
          }"
          row-key="id"
          :field-props="{
            title: $t('page.proNaive.table.rowEdit.title')
          }"
        >
          <template #toolbar>
            <NFlex>
              <NButton attr-type="reset">{{ $t('page.proNaive.table.rowEdit.reset') }}</NButton>
              <NButton type="primary" attr-type="submit">{{ $t('page.proNaive.table.rowEdit.submit') }}</NButton>
            </NFlex>
          </template>
        </ProEditDataTable>
      </ProConfigProvider>
    </ProForm>
  </ConfigProvider>
</template>
