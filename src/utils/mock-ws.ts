import { nanoid } from '@sa/utils';

const PUSH_INTERVAL = 30 * 1000;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 2000;

const systemTitles = [
  '系统维护提醒',
  '安全登录通知',
  '功能更新公告',
  '数据备份完成',
  '服务器状态通知',
  '系统性能优化',
  '新功能上线',
  '权限更新通知'
];

const systemContents = [
  '系统将在今晚进行例行维护，请提前保存您的工作。',
  '您的账户在新设备上登录，如非本人操作请及时修改密码。',
  '系统已更新至最新版本，新增多项功能，欢迎体验。',
  '您的数据已成功备份至云端，数据安全有保障。',
  '服务器运行状态良好，所有服务正常运行。',
  '系统性能已优化，页面加载速度提升 50%。',
  '通知中心功能已正式上线，及时获取重要消息。',
  '您的账户权限已更新，请查看最新的权限设置。'
];

const todoTitles = [
  '待办任务提醒',
  '文档待审核',
  '会议安排通知',
  '项目进度跟进',
  '周报提交提醒',
  '任务分配通知',
  '审批待处理',
  '客户反馈处理'
];

const todoContents = [
  '您有一个待办任务即将到期，请尽快处理。',
  '有新的文档需要您审核，请在 24 小时内完成。',
  '您有一个新的会议安排，请注意查看会议详情。',
  '项目进度需要更新，请及时填写最新的进度情况。',
  '请在本周五前提交本周工作报告。',
  '您已被分配新的任务，请查看任务详情。',
  '有一个审批流程等待您处理，请及时操作。',
  '收到客户反馈，请在 2 个工作日内回复处理。'
];

const levels: Notification.NotificationLevel[] = ['info', 'success', 'warning', 'error'];

interface MockWSOptions {
  onMessage: (message: Notification.WebSocketMessage) => void;
  onConnected: () => void;
  onDisconnected: () => void;
  onError?: (error: string) => void;
}

let pushInterval: ReturnType<typeof setInterval> | null = null;
let reconnectAttempts = 0;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let isConnected = false;
let currentOptions: MockWSOptions | null = null;

function generateMockNotification(): Notification.NotificationItem {
  const isSystem = Math.random() > 0.5;
  const titles = isSystem ? systemTitles : todoTitles;
  const contents = isSystem ? systemContents : todoContents;

  const titleIndex = Math.floor(Math.random() * titles.length);
  const levelIndex = Math.floor(Math.random() * levels.length);

  return {
    id: nanoid(),
    title: titles[titleIndex],
    content: contents[titleIndex],
    type: isSystem ? 'system' : 'todo',
    status: 'unread',
    level: levels[levelIndex],
    createdAt: new Date().toISOString()
  };
}

function createWebSocketMessage(type: Notification.WebSocketMessage['type'], data?: Notification.NotificationItem): Notification.WebSocketMessage {
  return {
    type,
    data,
    timestamp: Date.now()
  };
}

function startPushInterval() {
  if (pushInterval) {
    clearInterval(pushInterval);
  }

  pushInterval = setInterval(() => {
    if (isConnected && currentOptions) {
      const notification = generateMockNotification();
      const message = createWebSocketMessage('notification', notification);
      currentOptions.onMessage(message);
    }
  }, PUSH_INTERVAL);
}

function stopPushInterval() {
  if (pushInterval) {
    clearInterval(pushInterval);
    pushInterval = null;
  }
}

function connect() {
  setTimeout(() => {
    isConnected = true;
    reconnectAttempts = 0;
    currentOptions?.onConnected();
    startPushInterval();
  }, 500);
}

function attemptReconnect() {
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    currentOptions?.onError?.(`最大重连次数 ${MAX_RECONNECT_ATTEMPTS} 已达上限，无法连接`);
    return;
  }

  reconnectAttempts++;
  const delay = RECONNECT_DELAY * Math.min(reconnectAttempts, 3);

  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
  }

  reconnectTimer = setTimeout(() => {
    connect();
  }, delay);
}

export function initMockWebSocket(options: MockWSOptions) {
  currentOptions = options;

  connect();

  return {
    disconnect: () => {
      stopPushInterval();
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
      isConnected = false;
      options.onDisconnected();
    },
    reconnect: () => {
      if (!isConnected) {
        reconnectAttempts = 0;
        connect();
      }
    },
    send: (message: Notification.WebSocketMessage) => {
      if (message.type === 'ping' && isConnected) {
        const pongMessage = createWebSocketMessage('pong');
        options.onMessage(pongMessage);
      }
    },
    isConnected: () => isConnected
  };
}

export function simulateDisconnect() {
  if (isConnected) {
    stopPushInterval();
    isConnected = false;
    currentOptions?.onDisconnected();
    attemptReconnect();
  }
}

export function getPushInterval() {
  return PUSH_INTERVAL;
}
