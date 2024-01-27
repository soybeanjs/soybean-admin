<script setup lang="ts">
import { watch } from 'vue';
import { $t } from '@/locales';
import { roleStatusOptions } from '@/constants/business';
import { translateOptions } from '@/utils/common';
import { useRoleSearchContext } from './context';

defineOptions({
  name: 'RoleSearch'
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

// inject searchParams
const { searchParams } = useRoleSearchContext();

function reset() {
  emit('reset');
}

function search() {
  emit('search');
}

watch(
  () => searchParams,
  val => {
    console.log('val: ', val);
  },
  {
    deep: true
  }
);
</script>

<template>
  <NCard :title="$t('common.search')" :bordered="false" size="small" class="card-wrapper">
    <NForm :model="searchParams" label-placement="left">
      <NGrid responsive="screen" item-responsive>
        <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.role.roleName')" path="roleName" class="pr-24px">
          <NInput v-model:value="searchParams.roleName" :placeholder="$t('page.manage.role.form.roleName')" />
        </NFormItemGi>
        <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.role.roleCode')" path="roleCode" class="pr-24px">
          <NInput v-model:value="searchParams.roleCode" :placeholder="$t('page.manage.role.form.roleCode')" />
        </NFormItemGi>
        <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.role.roleStatus')" path="roleStatus" class="pr-24px">
          <NSelect
            v-model:value="searchParams.roleStatus"
            :placeholder="$t('page.manage.role.form.roleStatus')"
            :options="translateOptions(roleStatusOptions)"
            clearable
          />
        </NFormItemGi>
        <NFormItemGi span="24 s:12 m:6">
          <NSpace class="w-full" justify="end">
            <NButton @click="reset">
              <template #icon>
                <icon-ic-round-refresh class="text-icon" />
              </template>
              {{ $t('common.reset') }}
            </NButton>
            <NButton type="primary" ghost @click="search">
              <template #icon>
                <icon-ic-round-search class="text-icon" />
              </template>
              {{ $t('common.search') }}
            </NButton>
          </NSpace>
        </NFormItemGi>
      </NGrid>
    </NForm>
  </NCard>
</template>

<style scoped></style>
