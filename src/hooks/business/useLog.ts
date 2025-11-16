import { LogApi } from '@/service/log/api';
import { useAuthStore } from '@/store/modules/auth';

/** Get client IP address */
function getClientIp(): string {
  // In real implementation, this would get the actual client IP
  // For now, we'll use a placeholder or get from localStorage
  return localStorage.getItem('clientIp') || '127.0.0.1';
}

/** Log hook */
export function useLog() {
  const authStore = useAuthStore();

  /**
   * Record a log
   * @param operationType Operation type
   * @param target Operation target
   * @param result Operation result
   * @param details Operation details
   * @param level Log level
   * @param isAsync Whether to use async mode
   */
  function recordLog(
    operationType: Api.Log.OperationType,
    target: string,
    result: Api.Log.OperationResult,
    details: any,
    level: Api.Log.LogLevel = 'INFO',
    isAsync: boolean = true
  ) {
    const logRecord = {
      userId: authStore.userInfo.userId,
      userName: authStore.userInfo.userName,
      timestamp: Date.now(),
      level,
      operationType,
      target,
      clientIp: getClientIp(),
      result,
      details: JSON.stringify(details)
    };

    if (isAsync) {
      return LogApi.recordLogAsync(logRecord);
    } else {
      return LogApi.recordLogSync(logRecord);
    }
  }

  /**
   * Record a login log
   * @param userName User name
   * @param result Login result
   * @param details Login details
   */
  function recordLoginLog(userName: string, result: Api.Log.OperationResult, details: any = {}) {
    const logRecord = {
      userId: '',
      userName,
      timestamp: Date.now(),
      level: result === 'SUCCESS' ? 'INFO' : 'ERROR',
      operationType: 'LOGIN',
      target: '系统登录',
      clientIp: getClientIp(),
      result,
      details: JSON.stringify(details)
    };

    return LogApi.recordLogSync(logRecord);
  }

  /**
   * Record a logout log
   * @param result Logout result
   * @param details Logout details
   */
  function recordLogoutLog(result: Api.Log.OperationResult = 'SUCCESS', details: any = {}) {
    const logRecord = {
      userId: authStore.userInfo.userId,
      userName: authStore.userInfo.userName,
      timestamp: Date.now(),
      level: 'INFO',
      operationType: 'LOGOUT',
      target: '系统登出',
      clientIp: getClientIp(),
      result,
      details: JSON.stringify(details)
    };

    return LogApi.recordLogAsync(logRecord);
  }

  /**
   * Record a CRUD operation log
   * @param crudType CRUD type (CREATE/READ/UPDATE/DELETE)
   * @param target Operation target
   * @param result Operation result
   * @param details Operation details
   * @param level Log level
   * @param isAsync Whether to use async mode
   */
  function recordCrudLog(
    crudType: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE',
    target: string,
    result: Api.Log.OperationResult,
    details: any = {},
    level: Api.Log.LogLevel = 'INFO',
    isAsync: boolean = true
  ) {
    const logRecord = {
      userId: authStore.userInfo.userId,
      userName: authStore.userInfo.userName,
      timestamp: Date.now(),
      level,
      operationType: crudType as Api.Log.OperationType,
      target,
      clientIp: getClientIp(),
      result,
      details: JSON.stringify(details)
    };

    if (isAsync) {
      return LogApi.recordLogAsync(logRecord);
    } else {
      return LogApi.recordLogSync(logRecord);
    }
  }

  /**
   * Record a permission change log
   * @param target Target permission
   * @param result Operation result
   * @param details Operation details
   * @param level Log level
   */
  function recordPermissionChangeLog(
    target: string,
    result: Api.Log.OperationResult,
    details: any = {},
    level: Api.Log.LogLevel = 'WARN'
  ) {
    const logRecord = {
      userId: authStore.userInfo.userId,
      userName: authStore.userInfo.userName,
      timestamp: Date.now(),
      level,
      operationType: 'PERMISSION_CHANGE',
      target,
      clientIp: getClientIp(),
      result,
      details: JSON.stringify(details)
    };

    return LogApi.recordLogSync(logRecord);
  }

  /**
   * Record a config change log
   * @param target Target config
   * @param result Operation result
   * @param details Operation details
   * @param level Log level
   */
  function recordConfigChangeLog(
    target: string,
    result: Api.Log.OperationResult,
    details: any = {},
    level: Api.Log.LogLevel = 'WARN'
  ) {
    const logRecord = {
      userId: authStore.userInfo.userId,
      userName: authStore.userInfo.userName,
      timestamp: Date.now(),
      level,
      operationType: 'CONFIG_CHANGE',
      target,
      clientIp: getClientIp(),
      result,
      details: JSON.stringify(details)
    };

    return LogApi.recordLogSync(logRecord);
  }

  /**
   * Record a sensitive access log
   * @param target Target resource
   * @param result Operation result
   * @param details Operation details
   * @param level Log level
   */
  function recordSensitiveAccessLog(
    target: string,
    result: Api.Log.OperationResult,
    details: any = {},
    level: Api.Log.LogLevel = 'ERROR'
  ) {
    const logRecord = {
      userId: authStore.userInfo.userId,
      userName: authStore.userInfo.userName,
      timestamp: Date.now(),
      level,
      operationType: 'SENSITIVE_ACCESS',
      target,
      clientIp: getClientIp(),
      result,
      details: JSON.stringify(details)
    };

    return LogApi.recordLogSync(logRecord);
  }

  /**
   * Search logs
   * @param params Search parameters
   */
  function searchLogs(params: Api.Log.LogSearchParams) {
    return LogApi.searchLogs(params);
  }

  /**
   * Export logs
   * @param params Export parameters
   */
  function exportLogs(params: Api.Log.LogExportParams) {
    return LogApi.exportLogs(params);
  }

  /**
   * Verify logs integrity
   */
  function verifyLogsIntegrity() {
    return LogApi.verifyLogsIntegrity();
  }

  return {
    recordLog,
    recordLoginLog,
    recordLogoutLog,
    recordCrudLog,
    recordPermissionChangeLog,
    recordConfigChangeLog,
    recordSensitiveAccessLog,
    searchLogs,
    exportLogs,
    verifyLogsIntegrity
  };
}
