<template>
  <div class="py-16px">
    <n-grid cols="1 s:2 m:3 l:8 xl:8 2xl:8" responsive="screen" :x-gap="16" :y-gap="8">
      <n-grid-item v-for="item in navData" :key="item.label">
        <n-card content-style="padding-top: 0;" size="small" :bordered="false">
          <template #footer>
            <n-skeleton v-if="loading" size="medium" />
            <div v-else class="cursor-pointer">
              <p class="flex-x-center">
                <span>
                  <n-icon :size="32" class="flex-1" :color="item.color">
                    <Icon :icon="item.icon" />
                  </n-icon>
                </span>
              </p>
              <p class="flex-x-center">
                <span>{{ item.label }}</span>
              </p>
            </div>
          </template>
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script lang="ts" setup>
import { NGrid, NGridItem, NCard, NSkeleton, NIcon } from 'naive-ui';
import { Icon } from '@iconify/vue';

interface NavData {
  label: string;
  color: string;
  icon: String;
}

defineProps({
  loading: {
    type: Boolean,
    required: true
  }
});

const navData: NavData[] = [
  {
    label: '用户',
    color: '#69c0ff',
    icon: 'ant-design:usergroup-add-outlined'
  },
  {
    label: '分析',
    color: '#69c0ff',
    icon: 'ant-design:bar-chart-outlined'
  },
  {
    label: '商品',
    color: '#ff9c6e',
    icon: 'ant-design:shopping-cart-outlined'
  },
  {
    label: '订单',
    color: '#b37feb',
    icon: 'ant-design:account-book-outlined'
  },
  {
    label: '票据',
    color: '#ffd666',
    icon: 'ant-design:credit-card-outlined'
  },
  {
    label: '消息',
    color: '#5cdbd3',
    icon: 'ant-design:mail-outlined'
  },
  {
    label: '标签',
    color: '#ff85c0',
    icon: 'ant-design:tags-outlined'
  },
  {
    label: '配置',
    color: '#ffc069',
    icon: 'ant-design:setting-outlined'
  }
];
</script>
<style scoped></style>
