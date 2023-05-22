<template>
  <div class="h-full fs-page-header-group">
    <fs-crud ref="crudRef" v-bind="crudBinding" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useFs } from '@fast-crud/fast-crud';
import createCrudOptions from './crud';

export default defineComponent({
  name: 'CrudHeaderGroup',
  setup() {
    const { crudRef, crudBinding, crudExpose } = useFs({ createCrudOptions });

    // 页面打开后获取列表数据
    onMounted(() => {
      crudExpose.doRefresh();
    });

    return {
      crudBinding,
      crudRef
    };
  }
});
</script>
<style lang="scss">
.fs-page-header-group {
}
</style>
