import { localStg } from '@/utils/storage';
import { sha256 } from 'crypto-js';
import AES from 'crypto-js/aes';
import encUTF8 from 'crypto-js/enc-utf8';

/** Log storage key */
const LOG_STORAGE_KEY = 'audit_logs';
/** Log archive storage key */
const LOG_ARCHIVE_KEY = 'audit_logs_archive';
/** Encryption key (should be stored in environment variables in production) */
const ENCRYPTION_KEY = import.meta.env.VITE_LOG_ENCRYPTION_KEY || 'default_encryption_key_12345678901234567890123456789012';

/** Log storage service */
export class LogStorage {
  /**
   * Generate SHA-256 hash for log record
   * @param logRecord Log record
   * @returns Hash value
   */
  private static generateHash(logRecord: any, previousHash: string): string {
    const data = `${previousHash}${JSON.stringify(logRecord)}`;
    return sha256(data).toString();
  }

  /**
   * Encrypt sensitive log information
   * @param data Data to encrypt
   * @returns Encrypted data
   */
  private static encryptData(data: string): string {
    return AES.encrypt(data, ENCRYPTION_KEY).toString();
  }

  /**
   * Decrypt sensitive log information
   * @param encryptedData Encrypted data
   * @returns Decrypted data
   */
  private static decryptData(encryptedData: string): string {
    try {
      const bytes = AES.decrypt(encryptedData, ENCRYPTION_KEY);
      return bytes.toString(encUTF8);
    } catch {
      return encryptedData;
    }
  }

  /**
   * Get all logs from storage
   * @returns Log records
   */
  private static getAllLogs(): Api.Log.LogRecord[] {
    const logs = localStg.get(LOG_STORAGE_KEY, []);
    // Ensure logs is an array
    if (!Array.isArray(logs)) {
      return [];
    }
    // Decrypt sensitive information
    return logs.map((log: any) => ({
      ...log,
      details: this.decryptData(log.details)
    }));
  }

  /**
   * Save logs to storage
   * @param logs Log records
   */
  private static saveLogs(logs: Api.Log.LogRecord[]): void {
    // Encrypt sensitive information before saving
    const encryptedLogs = logs.map(log => ({
      ...log,
      details: this.encryptData(log.details)
    }));
    localStg.set(LOG_STORAGE_KEY, encryptedLogs);
  }

  /**
   * Write a log record
   * @param logRecord Log record
   * @returns Written log record with hash
   */
  static writeLog(logRecord: Omit<Api.Log.LogRecord, 'logId' | 'hash' | 'previousHash'>): Api.Log.LogRecord {
    const logs = this.getAllLogs();
    const previousHash = logs.length > 0 ? logs[logs.length - 1].hash : '0000000000000000000000000000000000000000000000000000000000000000';
    
    const newLog: Api.Log.LogRecord = {
      ...logRecord,
      logId: `log_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
      previousHash,
      hash: ''
    };

    // Generate hash
    newLog.hash = this.generateHash(newLog, previousHash);
    
    // Add to logs
    logs.push(newLog);
    this.saveLogs(logs);
    
    // Check if need to archive
    this.checkArchive();
    
    return newLog;
  }

  /**
   * Batch write log records
   * @param logRecords Log records
   * @returns Written log records with hashes
   */
  static batchWriteLogs(logRecords: Omit<Api.Log.LogRecord, 'logId' | 'hash' | 'previousHash'>[]): Api.Log.LogRecord[] {
    const logs = this.getAllLogs();
    let previousHash = logs.length > 0 ? logs[logs.length - 1].hash : '0000000000000000000000000000000000000000000000000000000000000000';
    
    const writtenLogs: Api.Log.LogRecord[] = [];
    
    for (const record of logRecords) {
      const newLog: Api.Log.LogRecord = {
        ...record,
        logId: `log_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
        previousHash,
        hash: ''
      };

      // Generate hash
      newLog.hash = this.generateHash(newLog, previousHash);
      previousHash = newLog.hash;
      
      writtenLogs.push(newLog);
      logs.push(newLog);
    }
    
    this.saveLogs(logs);
    
    // Check if need to archive
    this.checkArchive();
    
    return writtenLogs;
  }

  /**
   * Search logs
   * @param params Search parameters
   * @returns Search result
   */
  static searchLogs(params: Api.Log.LogSearchParams): Api.Log.LogSearchResult {
    let logs = this.getAllLogs();
    
    // Filter logs based on parameters
    if (params.userId) {
      logs = logs.filter(log => log.userId === params.userId);
    }
    
    if (params.userName) {
      logs = logs.filter(log => log.userName.includes(params.userName));
    }
    
    if (params.startTime) {
      logs = logs.filter(log => log.timestamp >= params.startTime);
    }
    
    if (params.endTime) {
      logs = logs.filter(log => log.timestamp <= params.endTime);
    }
    
    if (params.level) {
      logs = logs.filter(log => log.level === params.level);
    }
    
    if (params.operationType) {
      logs = logs.filter(log => log.operationType === params.operationType);
    }
    
    if (params.result) {
      logs = logs.filter(log => log.result === params.result);
    }
    
    // Pagination
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    const paginatedLogs = logs.slice(startIndex, endIndex);
    
    return {
      list: paginatedLogs,
      total: logs.length
    };
  }

  /**
   * Verify log integrity
   * @returns Verification result
   */
  static verifyLogs(): boolean {
    const logs = this.getAllLogs();
    
    if (logs.length === 0) return true;
    
    // Verify the first log
    if (logs[0].previousHash !== '0000000000000000000000000000000000000000000000000000000000000000') {
      return false;
    }
    
    // Generate hash for the first log
    const firstLogHash = this.generateHash(
      { ...logs[0], hash: '' },
      logs[0].previousHash
    );
    
    if (firstLogHash !== logs[0].hash) {
      return false;
    }
    
    // Verify subsequent logs
    for (let i = 1; i < logs.length; i++) {
      const previousLog = logs[i - 1];
      const currentLog = logs[i];
      
      if (currentLog.previousHash !== previousLog.hash) {
        return false;
      }
      
      // Generate hash for current log
      const currentLogHash = this.generateHash(
        { ...currentLog, hash: '' },
        currentLog.previousHash
      );
      
      if (currentLogHash !== currentLog.hash) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Check if need to archive logs
   */
  private static checkArchive(): void {
    const logs = this.getAllLogs();
    const archiveThresholdDays = 90;
    const archiveThresholdSize = 10 * 1024 * 1024; // 10GB
    
    // Check by time
    const archiveTimeThreshold = Date.now() - archiveThresholdDays * 24 * 60 * 60 * 1000;
    const oldLogs = logs.filter(log => log.timestamp < archiveTimeThreshold);
    
    if (oldLogs.length > 0) {
      // Archive old logs
      const archives = localStg.get(LOG_ARCHIVE_KEY, []);
      const newArchive = {
        archiveId: `archive_${Date.now()}`,
        createTime: Date.now(),
        logCount: oldLogs.length,
        logs: oldLogs
      };
      archives.push(newArchive);
      localStg.set(LOG_ARCHIVE_KEY, archives);
      
      // Remove old logs from active storage
      const remainingLogs = logs.filter(log => log.timestamp >= archiveTimeThreshold);
      this.saveLogs(remainingLogs);
    }
    
    // Check by size (simplified: check log count)
    const LOG_SIZE_PER_RECORD = 500; // Estimated size per log record in bytes
    if (logs.length * LOG_SIZE_PER_RECORD > archiveThresholdSize) {
      // Archive oldest 50% logs
      const archiveCount = Math.floor(logs.length * 0.5);
      const archiveLogs = logs.slice(0, archiveCount);
      
      const archives = localStg.get(LOG_ARCHIVE_KEY, []);
      const newArchive = {
        archiveId: `archive_${Date.now()}`,
        createTime: Date.now(),
        logCount: archiveCount,
        logs: archiveLogs
      };
      archives.push(newArchive);
      localStg.set(LOG_ARCHIVE_KEY, archives);
      
      // Remove archived logs from active storage
      const remainingLogs = logs.slice(archiveCount);
      this.saveLogs(remainingLogs);
    }
  }

  /**
   * Get log archives
   * @returns Log archives
   */
  static getArchives(): any[] {
    return localStg.get(LOG_ARCHIVE_KEY, []);
  }

  /**
   * Clear all logs
   */
  static clearLogs(): void {
    localStg.remove(LOG_STORAGE_KEY);
    localStg.remove(LOG_ARCHIVE_KEY);
  }
}
