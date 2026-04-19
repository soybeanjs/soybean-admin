<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { NBadge, NButton, NEmpty, NList, NListItem, NPopover, NTabs, NTabPane, NTag, useDialog, useMessage } from 'naive-ui';
import { useNotificationStore } from '@/store/modules/notification';
import { useRouterPush } from '@/hooks/common/router';
import dayjs from 'dayjs';

defineOptions({
  name: 'NotificationBell'
});

const notificationStore = useNotificationStore();
const { routerPushByKey } = useRouterPush();
const dialog = useDialog();
const message = useMessage();

const popoverVisible = ref(false);
const activePanelTab = ref<Notification.NotificationType>('system');

const displayUnreadCount = computed(() => {
  return notificationStore.unreadCount;
});

const currentNotifications = computed(() => {
  if (activePanelTab.value === 'system') {
    return notificationStore.recentSystemNotifications;
  }
  return notificationStore.recentTodoNotifications;
});

const currentUnreadCount = computed(() => {
  if (activePanelTab.value === 'system') {
    return notificationStore.systemUnreadCount;
  }
  return notificationStore.todoUnreadCount;
});

function formatTime(time: string) {
  const now = dayjs();
  const target = dayjs(time);
  const diffMinutes = now.diff(target, 'minute');
  const diffHours = now.diff(target, 'hour');
  const diffDays = now.diff(target, 'day');

  if (diffMinutes < 1) {
    return '刚刚';
  }
  if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`;
  }
  if (diffHours < 24) {
    return `${diffHours}小时前`;
  }
  if (diffDays < 7) {
    return `${diffDays}天前`;
  }
  return target.format('MM-DD HH:mm');
}

function getLevelType(level: Notification.NotificationLevel) {
  const typeMap: Record<Notification.NotificationLevel, 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error'> = {
    info: 'info',
    success: 'success',
    warning: 'warning',
    error: 'error'
  };
  return typeMap[level];
}

function handleItemClick(notification: Notification.NotificationItem) {
  if (notification.status === 'unread') {
    notificationStore.markAsRead(notification.id);
  }
}

function handleMarkAllAsRead() {
  notificationStore.markAllAsRead(activePanelTab.value);
  message.success('已全部标记为已读');
}

function handleClearAll() {
  dialog.warning({
    title: '确认清空',
    content: `确定要清空所有${activePanelTab.value === 'system' ? '系统通知' : '我的待办'}吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      notificationStore.clearAllNotifications(activePanelTab.value);
      message.success('已清空');
    }
  });
}

function goToNotificationCenter() {
  popoverVisible.value = false;
  routerPushByKey('notification');
}

watch(popoverVisible, (visible) => {
  if (visible) {
    activePanelTab.value = notificationStore.activeTab;
  } else {
    notificationStore.setActiveTab(activePanelTab.value);
  }
});

onMounted(() => {
  notificationStore.initWebSocket();
});
</script>

<template>
  <NPopover
    v-model:show="popoverVisible"
    placement="bottom-end"
    trigger="click"
    :show-arrow="true"
    :overlay-style="{ width: '380px', padding: '0' }"
  >
    <template #trigger>
      <div class="relative cursor-pointer">
        <NBadge
          :value="displayUnreadCount"
          :max="99"
          :show-zero="false"
          :offset="[6, 6]"
          :color="'#ff4d4f'"
        >
          <ButtonIcon tooltip-content="消息通知">
            <SvgIcon icon="ph:bell" class="text-icon-large" />
          </ButtonIcon>
        </NBadge>
      </div>
    </template>

    <div class="p-0">
      <div class="px-16px py-12px border-b border-solid border-[var(--n-border-color)]">
        <NTabs
          v-model:value="activePanelTab"
          type="line"
          animated
          :tab-style="'min-width: 100px'"
        >
          <NTabPane name="system" tab="系统通知">
            <template #label>
              <span class="flex items-center gap-4px">
                系统通知
                <NTag
                  v-if="notificationStore.systemUnreadCount > 0"
                  type="error"
                  size="small"
                  round
                  :bordered="false"
                >
                  {{ notificationStore.systemUnreadCount }}
                </NTag>
              </span>
            </template>
          </NTabPane>
          <NTabPane name="todo" tab="我的待办">
            <template #label>
              <span class="flex items-center gap-4px">
                我的待办
                <NTag
                  v-if="notificationStore.todoUnreadCount > 0"
                  type="error"
                  size="small"
                  round
                  :bordered="false"
                >
                  {{ notificationStore.todoUnreadCount }}
                </NTag>
              </span>
            </template>
          </NTabPane>
        </NTabs>
      </div>

      <div class="max-h-[320px] overflow-y-auto">
        <NList v-if="currentNotifications.length > 0" :bordered="false">
          <NListItem
            v-for="item in currentNotifications"
            :key="item.id"
            class="cursor-pointer transition-colors hover:bg-[var(--n-color-hover)]"
            :class="{
              'bg-[var(--n-color-info-hover)]': item.status === 'unread'
            }"
            @click="handleItemClick(item)"
          >
            <template #prefix>
              <div class="flex-shrink-0 mt-6px">
                <div
                  v-if="item.status === 'unread'"
                  class="w-6px h-6px rounded-full bg-primary-color"
                />
                <div v-else class="w-6px h-6px" />
              </div>
            </template>
            <template #main>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-8px mb-4px">
                  <NTag :type="getLevelType(item.level)" size="small" round :bordered="false">
                    {{ item.level === 'info' ? '信息' : item.level === 'success' ? '成功' : item.level === 'warning' ? '警告' : '错误' }}
                  </NTag>
                  <span
                    class="text-sm truncate"
                    :class="{
                      'font-medium': item.status === 'unread'
                    }"
                  >
                    {{ item.title }}
                  </span>
                </div>
                <p class="text-xs text-[var(--n-text-color-2)] line-clamp-2 mb-4px">
                  {{ item.content }}
                </p>
                <span class="text-[10px] text-[var(--n-text-color-3)]">
                  {{ formatTime(item.createdAt) }}
                </span>
              </div>
            </template>
          </NListItem>
        </NList>

        <NEmpty v-else description="暂无消息" :style="{ margin: '40px 0' }">
          <template #icon>
            <SvgIcon icon="ph:bell-slash" class="text-48px text-[var(--n-text-color-3)]" />
          </template>
        </NEmpty>
      </div>

      <div class="flex items-center justify-between px-16px py-12px border-t border-solid border-[var(--n-border-color)]">
        <div class="flex items-center gap-8px">
          <NButton
            v-if="currentUnreadCount > 0"
            quaternary
            size="small"
            @click="handleMarkAllAsRead"
          >
            全部已读
          </NButton>
          <NButton
            v-if="currentNotifications.length > 0"
            quaternary
            size="small"
            @click="handleClearAll"
          >
            清空
          </NButton>
        </div>
        <NButton quaternary size="small" @click="goToNotificationCenter">
          查看全部
          <SvgIcon icon="ph:arrow-right" class="ml-4px" />
        </NButton>
      </div>
    </div>
  </NPopover>
</template>

<style scoped>
</style>
