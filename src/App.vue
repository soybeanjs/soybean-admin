<template>
  <el-config-provider :locale="locale">
    <div>
      <el-date-picker />
    </div>
  </el-config-provider>
</template>

<script lang="ts" setup>
import { ElConfigProvider } from 'element-plus';
import locale from 'element-plus/lib/locale/lang/zh-cn';
</script>
<style></style>
