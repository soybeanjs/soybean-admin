import { computed, effectScope, onScopeDispose, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { nanoid } from '@sa/utils';
import { localStg } from '@/utils/storage';
import { SetupStoreId } from '@/enum';
import { initMockWebSocket } from '@/utils/mock-ws';

const STORAGE_KEY_UNREAD_COUNT = 'notificationUnreadCount';
const STORAGE_KEY_LIST = 'notificationList';

const initialNotifications: Notification.NotificationItem[] = [
  {
    id: '1',
    title: '系统更新通知',
    content: '系统将于今晚 23:00 进行例行维护，预计持续 1 小时。请提前保存您的工作。',
    type: 'system',
    status: 'unread',
    level: 'warning',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  },
  {
    id: '2',
    title: '您有一个待办任务需要处理',
    content: '项目 A 的文档审核任务已分配给您，请在 3 天内完成审核。',
    type: 'todo',
    status: 'unread',
    level: 'info',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    id: '3',
    title: '安全提醒',
    content: '您的账户在新设备上登录，请确认是否为本人操作。',
    type: 'system',
    status: 'unread',
    level: 'error',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
  },
  {
    id: '4',
    title: '周报提交提醒',
    content: '请在本周五 18:00 前提交本周工作报告。',
    type: 'todo',
    status: 'read',
    level: 'info',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    readAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
  },
  {
    id: '5',
    title: '欢迎使用通知中心',
    content: '这是一条系统欢迎消息，通知中心功能已正式上线。',
    type: 'system',
    status: 'read',
    level: 'success',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    readAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString()
  }
];

function loadStoredData() {
  const storedList = localStg.get<Notification.NotificationItem[]>(STORAGE_KEY_LIST);
  const storedUnreadCount = localStg.get<number>(STORAGE_KEY_UNREAD_COUNT);

  return {
    list: storedList || initialNotifications,
    unreadCount: storedUnreadCount !== null ? storedUnreadCount : 3
  };
}

export const useNotificationStore = defineStore(SetupStoreId.Notification, () => {
  const scope = effectScope();

  const { list: initialList, unreadCount: initialUnreadCount } = loadStoredData();

  const notificationList = ref<Notification.NotificationItem[]>(initialList);

  const unreadCount = ref<number>(initialUnreadCount);

  const systemUnreadCount = computed(() => {
    return notificationList.value.filter(n => n.type === 'system' && n.status === 'unread').length;
  });

  const todoUnreadCount = computed(() => {
    return notificationList.value.filter(n => n.type === 'todo' && n.status === 'unread').length;
  });

  const activeTab = ref<Notification.NotificationType>('system');

  const wsConnected = ref<boolean>(false);

  const pagination = ref<Notification.NotificationState['pagination']>({
    current: 1,
    pageSize: 10,
    total: notificationList.value.length,
    hasMore: false
  });

  const systemNotifications = computed(() => {
    return notificationList.value.filter(n => n.type === 'system');
  });

  const todoNotifications = computed(() => {
    return notificationList.value.filter(n => n.type === 'todo');
  });

  const recentSystemNotifications = computed(() => {
    return systemNotifications.value.slice(0, 5);
  });

  const recentTodoNotifications = computed(() => {
    return todoNotifications.value.slice(0, 5);
  });

  function addNotification(notification: Notification.NotificationItem) {
    notificationList.value.unshift(notification);
    if (notification.status === 'unread') {
      unreadCount.value++;
    }
    saveToStorage();
    showNotificationPopup(notification);
  }

  function createNotification(
    title: string,
    content: string,
    type: Notification.NotificationType,
    level: Notification.NotificationLevel = 'info'
  ): Notification.NotificationItem {
    return {
      id: nanoid(),
      title,
      content,
      type,
      status: 'unread',
      level,
      createdAt: new Date().toISOString()
    };
  }

  function markAsRead(id: string) {
    const notification = notificationList.value.find(n => n.id === id);
    if (notification && notification.status === 'unread') {
      notification.status = 'read';
      notification.readAt = new Date().toISOString();
      unreadCount.value = Math.max(0, unreadCount.value - 1);
      saveToStorage();
    }
  }

  function markAllAsRead(type?: Notification.NotificationType) {
    const notificationsToMark = type
      ? notificationList.value.filter(n => n.type === type && n.status === 'unread')
      : notificationList.value.filter(n => n.status === 'unread');

    let markedCount = 0;
    notificationsToMark.forEach(n => {
      n.status = 'read';
      n.readAt = new Date().toISOString();
      markedCount++;
    });

    unreadCount.value = Math.max(0, unreadCount.value - markedCount);
    saveToStorage();
  }

  function deleteNotification(id: string) {
    const index = notificationList.value.findIndex(n => n.id === id);
    if (index > -1) {
      const notification = notificationList.value[index];
      if (notification.status === 'unread') {
        unreadCount.value = Math.max(0, unreadCount.value - 1);
      }
      notificationList.value.splice(index, 1);
      saveToStorage();
    }
  }

  function clearAllNotifications(type?: Notification.NotificationType) {
    if (type) {
      const toRemove = notificationList.value.filter(n => n.type === type);
      const unreadToRemove = toRemove.filter(n => n.status === 'unread').length;
      notificationList.value = notificationList.value.filter(n => n.type !== type);
      unreadCount.value = Math.max(0, unreadCount.value - unreadToRemove);
    } else {
      notificationList.value = [];
      unreadCount.value = 0;
    }
    saveToStorage();
  }

  function getNotificationsByType(type: Notification.NotificationType): Notification.NotificationItem[] {
    return notificationList.value.filter(n => n.type === type);
  }

  function getNotificationsByFilter(filter: Notification.NotificationFilter): Notification.NotificationItem[] {
    return notificationList.value.filter(n => {
      if (filter.type && n.type !== filter.type) return false;
      if (filter.status && n.status !== filter.status) return false;
      if (filter.keyword) {
        const keyword = filter.keyword.toLowerCase();
        const titleMatch = n.title.toLowerCase().includes(keyword);
        const contentMatch = n.content.toLowerCase().includes(keyword);
        if (!titleMatch && !contentMatch) return false;
      }
      return true;
    });
  }

  function setActiveTab(tab: Notification.NotificationType) {
    activeTab.value = tab;
  }

  function setWsConnected(connected: boolean) {
    wsConnected.value = connected;
  }

  function loadMore() {
    pagination.value.current++;
    const start = (pagination.value.current - 1) * pagination.value.pageSize;
    const end = start + pagination.value.pageSize;
    pagination.value.hasMore = end < notificationList.value.length;
  }

  function resetPagination() {
    pagination.value.current = 1;
    pagination.value.total = notificationList.value.length;
    pagination.value.hasMore = pagination.value.pageSize < notificationList.value.length;
  }

  function saveToStorage() {
    localStg.set(STORAGE_KEY_LIST, notificationList.value);
    localStg.set(STORAGE_KEY_UNREAD_COUNT, unreadCount.value);
  }

  function showNotificationPopup(notification: Notification.NotificationItem) {
    const typeMap: Record<Notification.NotificationLevel, 'info' | 'success' | 'warning' | 'error'> = {
      info: 'info',
      success: 'success',
      warning: 'warning',
      error: 'error'
    };

    const notificationType = typeMap[notification.level];

    const title = notification.type === 'system' ? '系统通知' : '我的待办';

    if (window.$notification) {
      window.$notification[notificationType]({
        title,
        content: notification.title,
        duration: 4500
      });
    }
  }

  function initWebSocket() {
    initMockWebSocket({
      onMessage: (msg) => {
        if (msg.type === 'notification' && msg.data) {
          addNotification(msg.data);
        }
      },
      onConnected: () => {
        setWsConnected(true);
      },
      onDisconnected: () => {
        setWsConnected(false);
      }
    });
  }

  scope.run(() => {
    watch(
      [notificationList, unreadCount],
      () => {
        pagination.value.total = notificationList.value.length;
        saveToStorage();
      },
      { deep: true }
    );
  });

  onScopeDispose(() => {
    scope.stop();
  });

  return {
    notificationList,
    unreadCount,
    systemUnreadCount,
    todoUnreadCount,
    activeTab,
    wsConnected,
    pagination,
    systemNotifications,
    todoNotifications,
    recentSystemNotifications,
    recentTodoNotifications,
    addNotification,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getNotificationsByType,
    getNotificationsByFilter,
    setActiveTab,
    loadMore,
    resetPagination,
    initWebSocket
  };
});
