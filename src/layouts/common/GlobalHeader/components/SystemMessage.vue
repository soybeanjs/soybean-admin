<template>
  <n-popover trigger="click" class="!p-0" placement="bottom">
    <template #trigger>
      <hover-container tooltip-content="消息通知" class="w-40px h-full relative" :inverted="theme.header.inverted">
        <icon-clarity:notification-line class="text-18px" />
        <n-badge
          :value="count"
          :show="count > 0"
          :max="99"
          :class="[count < 10 ? '-right-2px' : '-right-10px']"
          class="absolute top-10px"
        />
      </hover-container>
    </template>
    <n-tabs v-model:value="currentTab" type="line" class="w-360px" justify-content="space-evenly">
      <n-tab-pane v-for="(item, index) in tabData" :key="item.key" :name="index">
        <template #tab>
          <div class="flex-x-center items-center w-120px">
            <span class="mr-5px">{{ item.name }}</span>
            <n-badge
              v-bind="item.badgeProps"
              :value="item.list.filter(message => !message.isRead).length"
              :max="99"
              :show="item.list.length !== 0"
            />
          </div>
        </template>
        <loading-empty-wrapper
          class="h-360px"
          :loading="loading"
          :empty="item.list.length === 0"
          placeholder-class="bg-$n-color transition-background-color duration-300 ease-in-out"
        >
          <message-list :list="item.list" />
        </loading-empty-wrapper>
      </n-tab-pane>
    </n-tabs>
    <div v-if="tabData[currentTab].list.length > 0" class="flex cursor-pointer border-t border-$n-divider-color">
      <div class="py-10px text-center flex-1" @click="handleClear(currentTab)">清空</div>
      <div class="py-10px text-center flex-1 border-l border-$n-divider-color" @click="handleAllRead(currentTab)">
        全部已读
      </div>
      <div class="py-10px text-center flex-1 border-l border-$n-divider-color" @click="handleLoadMore(currentTab)">
        查看更多
      </div>
    </div>
  </n-popover>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useThemeStore } from '@/store';
import { useBoolean } from '@/hooks';
import MessageList from './MessageList.vue';

const currentTab = ref(0);
const theme = useThemeStore();
const { bool: loading, setBool: setLoading } = useBoolean();
const tabData = ref<Message.Tab[]>([
  {
    key: 1,
    name: '通知',
    badgeProps: { type: 'warning' },
    list: [
      { id: 1, icon: 'ri:message-3-line', title: '你收到了5条新消息', date: '2022-06-17' },
      { id: 4, icon: 'ri:message-3-line', title: 'Soybean Admin 1.0.0 版本正在筹备中', date: '2022-06-17' },
      { id: 2, icon: 'ri:message-3-line', title: 'Soybean Admin 0.9.6 版本发布了', date: '2022-06-16' },
      { id: 3, icon: 'ri:message-3-line', title: 'Soybean Admin 0.9.5 版本发布了', date: '2022-06-07' },
      {
        id: 5,
        icon: 'ri:message-3-line',
        title: '测试超长标题测试超长标题测试超长标题测试超长标题测试超长标题测试超长标题测试超长标题测试超长标题',
        date: '2022-06-17'
      }
    ]
  },
  {
    key: 2,
    name: '消息',
    badgeProps: { type: 'error' },
    list: [
      {
        id: 1,
        title: '项目动态',
        svgIcon: 'avatar',
        description: 'Soybean 刚才把工作台页面随便写了一些，凑合能看了！',
        date: '2021-11-07 22:45:32'
      },
      {
        id: 2,
        title: '项目动态',
        svgIcon: 'avatar',
        description: 'Soybean 正在忙于为soybean-admin写项目说明文档！',
        date: '2021-11-03 20:33:31'
      },
      {
        id: 3,
        title: '项目动态',
        svgIcon: 'avatar',
        description: 'Soybean 准备为soybean-admin 1.0的发布做充分的准备工作！',
        date: '2021-10-31 22:43:12'
      },
      {
        id: 4,
        title: '项目动态',
        svgIcon: 'avatar',
        description: '@yanbowe 向soybean-admin提交了一个bug，多标签栏不会自适应。',
        date: '2021-10-27 10:24:54'
      },
      {
        id: 5,
        title: '项目动态',
        svgIcon: 'avatar',
        description: 'Soybean 在2021年5月28日创建了开源项目soybean-admin！',
        date: '2021-05-28 22:22:22'
      }
    ]
  },
  {
    key: 3,
    name: '待办',
    badgeProps: { type: 'info' },
    list: [
      {
        id: 1,
        icon: 'ri:calendar-todo-line',
        title: '缓存主题配置',
        description: '任务正在计划中',
        date: '2022-06-17',
        tagTitle: '未开始',
        tagProps: { type: 'default' }
      },
      {
        id: 2,
        icon: 'ri:calendar-todo-line',
        title: '添加锁屏组件、全局Iframe组件',
        description: '任务正在计划中',
        date: '2022-06-17',
        tagTitle: '未开始',
        tagProps: { type: 'default' }
      },
      {
        id: 3,
        icon: 'ri:calendar-todo-line',
        title: '示例页面完善',
        description: '任务正在计划中',
        date: '2022-06-17',
        tagTitle: '未开始',
        tagProps: { type: 'default' }
      },
      {
        id: 4,
        icon: 'ri:calendar-todo-line',
        title: '表单、表格示例',
        description: '任务正在计划中',
        date: '2022-06-17',
        tagTitle: '未开始',
        tagProps: { type: 'default' }
      },
      {
        id: 5,
        icon: 'ri:calendar-todo-line',
        title: '性能优化(优化递归函数)',
        description: '任务正在计划中',
        date: '2022-06-17',
        tagTitle: '未开始',
        tagProps: { type: 'default' }
      },
      {
        id: 6,
        icon: 'ri:calendar-todo-line',
        title: '精简版(新分支thin)',
        description: '任务正在计划中',
        date: '2022-06-17',
        tagTitle: '未开始',
        tagProps: { type: 'default' }
      }
    ]
  }
]);

const count = computed(() => {
  return tabData.value.reduce((acc, cur) => {
    return acc + cur.list.filter(item => !item.isRead).length;
  }, 0);
});

function handleClear(index: number) {
  tabData.value[index].list = [];
}

function handleAllRead(index: number) {
  tabData.value[index].list.map(item => Object.assign(item, { isRead: true }));
}

function handleLoadMore(index: number) {
  const { list } = tabData.value[index];
  setLoading(true);
  setTimeout(() => {
    list.push(...tabData.value[index].list);
    setLoading(false);
  }, 1000);
}
</script>
<style scoped></style>
