/** Notification namespace */
declare namespace Notification {
  /** Notification type */
  type NotificationType = 'system' | 'todo';

  /** Notification status */
  type NotificationStatus = 'unread' | 'read';

  /** Notification level */
  type NotificationLevel = 'info' | 'success' | 'warning' | 'error';

  /** Notification item */
  interface NotificationItem {
    /** Notification ID */
    id: string;
    /** Notification title */
    title: string;
    /** Notification content */
    content: string;
    /** Notification type */
    type: NotificationType;
    /** Notification status */
    status: NotificationStatus;
    /** Notification level */
    level: NotificationLevel;
    /** Creation time */
    createdAt: string;
    /** Read time */
    readAt?: string;
    /** Extra data */
    extra?: Record<string, any>;
  }

  /** Notification state in store */
  interface NotificationState {
    /** Notification list */
    list: NotificationItem[];
    /** Unread count */
    unreadCount: number;
    /** System unread count */
    systemUnreadCount: number;
    /** Todo unread count */
    todoUnreadCount: number;
    /** Current active tab */
    activeTab: NotificationType;
    /** WebSocket connection status */
    wsConnected: boolean;
    /** Pagination */
    pagination: {
      current: number;
      pageSize: number;
      total: number;
      hasMore: boolean;
    };
  }

  /** WebSocket message format */
  interface WebSocketMessage {
    /** Message type */
    type: 'notification' | 'ping' | 'pong' | 'error';
    /** Message data */
    data?: NotificationItem;
    /** Message */
    message?: string;
    /** Timestamp */
    timestamp: number;
  }

  /** Filter options for notification list */
  interface NotificationFilter {
    /** Filter by type */
    type?: NotificationType;
    /** Filter by status */
    status?: NotificationStatus;
    /** Search keyword */
    keyword?: string;
  }
}
