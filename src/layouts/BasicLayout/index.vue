<template>
  <n-layout has-sider>
    <n-layout-sider />
    <n-layout>
      <n-layout-header></n-layout-header>
      <n-layout-content>
        <router-view />
      </n-layout-content>
      <n-layout-footer></n-layout-footer>
    </n-layout>
  </n-layout>
</template>

<script lang="ts" setup></script>
<style scoped></style>
