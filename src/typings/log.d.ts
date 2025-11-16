declare namespace Api.Log {
  /** Log level enum */
  type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';

  /** Operation type enum */
  type OperationType = 'LOGIN' | 'LOGOUT' | 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'PERMISSION_CHANGE' | 'CONFIG_CHANGE' | 'SENSITIVE_ACCESS';

  /** Operation result enum */
  type OperationResult = 'SUCCESS' | 'FAILED' | 'PARTIAL_SUCCESS';

  /** Log record data structure */
  interface LogRecord {
    /** Unique log ID */
    logId: string;
    /** User ID */
    userId: string;
    /** User name */
    userName: string;
    /** Operation timestamp (milliseconds) */
    timestamp: number;
    /** Log level */
    level: LogLevel;
    /** Operation type */
    operationType: OperationType;
    /** Operation target */
    target: string;
    /** Client IP address */
    clientIp: string;
    /** Operation result */
    result: OperationResult;
    /** Operation details (JSON string) */
    details: string;
    /** Log hash value (for tamper-proof) */
    hash: string;
    /** Previous log hash (for chain verification) */
    previousHash: string;
  }

  /** Log search parameters */
  interface LogSearchParams {
    /** User ID */
    userId?: string;
    /** User name */
    userName?: string;
    /** Start time (milliseconds) */
    startTime?: number;
    /** End time (milliseconds) */
    endTime?: number;
    /** Log level */
    level?: LogLevel;
    /** Operation type */
    operationType?: OperationType;
    /** Operation result */
    result?: OperationResult;
    /** Current page */
    page?: number;
    /** Page size */
    pageSize?: number;
  }

  /** Log search result */
  interface LogSearchResult {
    /** Log list */
    list: LogRecord[];
    /** Total count */
    total: number;
  }

  /** Log export parameters */
  interface LogExportParams {
    /** Export format */
    format: 'CSV' | 'EXCEL' | 'PDF';
    /** Search parameters */
    searchParams: LogSearchParams;
  }

  /** Log export result */
  interface LogExportResult {
    /** Export file URL */
    fileUrl: string;
    /** File name */
    fileName: string;
    /** Data signature */
    signature: string;
  }
}
