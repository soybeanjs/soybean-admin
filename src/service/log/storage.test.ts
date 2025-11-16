import { describe, expect, it } from 'vitest';
import { LogStorage } from './storage';
import { localStg } from '@/utils/storage';

// Mock localStorage
localStg.set = vi.fn();
localStg.get = vi.fn(() => []);
localStg.remove = vi.fn();

describe('LogStorage', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('writeLog', () => {
    it('should write a log record correctly', () => {
      // Mock return empty logs initially
      (localStg.get as vi.Mock).mockReturnValue([]);
      
      const logRecord = {
        userId: 'test_user_id',
        userName: 'test_user',
        timestamp: Date.now(),
        level: 'INFO' as Api.Log.LogLevel,
        operationType: 'LOGIN' as Api.Log.OperationType,
        target: '系统登录',
        clientIp: '127.0.0.1',
        result: 'SUCCESS' as Api.Log.OperationResult,
        details: '{}'
      };
      
      const writtenLog = LogStorage.writeLog(logRecord);
      
      // Verify log has required fields
      expect(writtenLog).toHaveProperty('logId');
      expect(writtenLog).toHaveProperty('hash');
      expect(writtenLog).toHaveProperty('previousHash');
      expect(writtenLog.userId).toBe(logRecord.userId);
      expect(writtenLog.userName).toBe(logRecord.userName);
      expect(writtenLog.timestamp).toBe(logRecord.timestamp);
      expect(writtenLog.level).toBe(logRecord.level);
      expect(writtenLog.operationType).toBe(logRecord.operationType);
      expect(writtenLog.target).toBe(logRecord.target);
      expect(writtenLog.clientIp).toBe(logRecord.clientIp);
      expect(writtenLog.result).toBe(logRecord.result);
      
      // Verify localStg.set was called
      expect(localStg.set).toHaveBeenCalled();
    });
  });

  describe('batchWriteLogs', () => {
    it('should batch write log records correctly', () => {
      // Mock return empty logs initially
      (localStg.get as vi.Mock).mockReturnValue([]);
      
      const logRecords = [
        {
          userId: 'test_user_id_1',
          userName: 'test_user_1',
          timestamp: Date.now(),
          level: 'INFO' as Api.Log.LogLevel,
          operationType: 'LOGIN' as Api.Log.OperationType,
          target: '系统登录',
          clientIp: '127.0.0.1',
          result: 'SUCCESS' as Api.Log.OperationResult,
          details: '{}'
        },
        {
          userId: 'test_user_id_2',
          userName: 'test_user_2',
          timestamp: Date.now(),
          level: 'INFO' as Api.Log.LogLevel,
          operationType: 'LOGOUT' as Api.Log.OperationType,
          target: '系统登出',
          clientIp: '127.0.0.1',
          result: 'SUCCESS' as Api.Log.OperationResult,
          details: '{}'
        }
      ];
      
      const writtenLogs = LogStorage.batchWriteLogs(logRecords);
      
      // Verify logs were written correctly
      expect(writtenLogs).toHaveLength(2);
      expect(writtenLogs[0]).toHaveProperty('logId');
      expect(writtenLogs[0]).toHaveProperty('hash');
      expect(writtenLogs[1]).toHaveProperty('logId');
      expect(writtenLogs[1]).toHaveProperty('hash');
      expect(writtenLogs[1].previousHash).toBe(writtenLogs[0].hash);
      
      // Verify localStg.set was called
      expect(localStg.set).toHaveBeenCalled();
    });
  });

  describe('searchLogs', () => {
    it('should search logs correctly', () => {
      const timestamp = Date.now();
      const mockLogs = [
        {
          logId: 'log_1',
          userId: 'test_user_id_1',
          userName: 'test_user_1',
          timestamp,
          level: 'INFO' as Api.Log.LogLevel,
          operationType: 'LOGIN' as Api.Log.OperationType,
          target: '系统登录',
          clientIp: '127.0.0.1',
          result: 'SUCCESS' as Api.Log.OperationResult,
          details: '{}',
          hash: 'hash_1',
          previousHash: '0000000000000000000000000000000000000000000000000000000000000000'
        },
        {
          logId: 'log_2',
          userId: 'test_user_id_2',
          userName: 'test_user_2',
          timestamp: timestamp + 1000,
          level: 'ERROR' as Api.Log.LogLevel,
          operationType: 'LOGIN' as Api.Log.OperationType,
          target: '系统登录',
          clientIp: '127.0.0.1',
          result: 'FAILED' as Api.Log.OperationResult,
          details: '{}',
          hash: 'hash_2',
          previousHash: 'hash_1'
        }
      ];
      
      // Mock return mock logs
      (localStg.get as vi.Mock).mockReturnValue(mockLogs);
      
      // Test search by userId
      const result1 = LogStorage.searchLogs({ userId: 'test_user_id_1' });
      expect(result1.list).toHaveLength(1);
      expect(result1.list[0].userId).toBe('test_user_id_1');
      
      // Test search by level
      const result2 = LogStorage.searchLogs({ level: 'ERROR' });
      expect(result2.list).toHaveLength(1);
      expect(result2.list[0].level).toBe('ERROR');
      
      // Test search by operationType
      const result3 = LogStorage.searchLogs({ operationType: 'LOGIN' });
      expect(result3.list).toHaveLength(2);
      
      // Test search by result
      const result4 = LogStorage.searchLogs({ result: 'SUCCESS' });
      expect(result4.list).toHaveLength(1);
      expect(result4.list[0].result).toBe('SUCCESS');
    });
  });

  describe('verifyLogs', () => {
    it('should verify logs integrity correctly when logs are intact', () => {
      const timestamp = Date.now();
      // Create valid chain of logs
      const log1 = {
        logId: 'log_1',
        userId: 'test_user_id_1',
        userName: 'test_user_1',
        timestamp,
        level: 'INFO' as Api.Log.LogLevel,
        operationType: 'LOGIN' as Api.Log.OperationType,
        target: '系统登录',
        clientIp: '127.0.0.1',
        result: 'SUCCESS' as Api.Log.OperationResult,
        details: '{}',
        hash: '',
        previousHash: '0000000000000000000000000000000000000000000000000000000000000000'
      };
      log1.hash = LogStorage['generateHash'](log1, log1.previousHash);
      
      const log2 = {
        logId: 'log_2',
        userId: 'test_user_id_2',
        userName: 'test_user_2',
        timestamp: timestamp + 1000,
        level: 'ERROR' as Api.Log.LogLevel,
        operationType: 'LOGIN' as Api.Log.OperationType,
        target: '系统登录',
        clientIp: '127.0.0.1',
        result: 'FAILED' as Api.Log.OperationResult,
        details: '{}',
        hash: '',
        previousHash: log1.hash
      };
      log2.hash = LogStorage['generateHash'](log2, log2.previousHash);
      
      const mockLogs = [log1, log2];
      
      // Mock return mock logs
      (localStg.get as vi.Mock).mockReturnValue(mockLogs);
      
      const result = LogStorage.verifyLogs();
      expect(result).toBe(true);
    });
    
    it('should verify logs integrity correctly when logs are tampered', () => {
      const timestamp = Date.now();
      // Create valid chain of logs
      const log1 = {
        logId: 'log_1',
        userId: 'test_user_id_1',
        userName: 'test_user_1',
        timestamp,
        level: 'INFO' as Api.Log.LogLevel,
        operationType: 'LOGIN' as Api.Log.OperationType,
        target: '系统登录',
        clientIp: '127.0.0.1',
        result: 'SUCCESS' as Api.Log.OperationResult,
        details: '{}',
        hash: '',
        previousHash: '0000000000000000000000000000000000000000000000000000000000000000'
      };
      log1.hash = LogStorage['generateHash'](log1, log1.previousHash);
      
      const log2 = {
        logId: 'log_2',
        userId: 'test_user_id_2',
        userName: 'test_user_2',
        timestamp: timestamp + 1000,
        level: 'ERROR' as Api.Log.LogLevel,
        operationType: 'LOGIN' as Api.Log.OperationType,
        target: '系统登录',
        clientIp: '127.0.0.1',
        result: 'FAILED' as Api.Log.OperationResult,
        details: '{}',
        hash: 'tampered_hash', // Tampered hash
        previousHash: log1.hash
      };
      
      const mockLogs = [log1, log2];
      
      // Mock return mock logs
      (localStg.get as vi.Mock).mockReturnValue(mockLogs);
      
      const result = LogStorage.verifyLogs();
      expect(result).toBe(false);
    });
  });
});
