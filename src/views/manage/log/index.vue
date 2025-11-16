<template>
  <div class="log-management-page">
    <n-card title="用户操作日志审计系统" :bordered="false" class="page-card">
      <!-- 日志搜索表单 -->
      <n-form layout="inline" class="search-form" ref="searchFormRef">
        <n-form-item label="用户ID">
          <n-input v-model:value="searchParams.userId" placeholder="请输入用户ID" />
        </n-form-item>
        
        <n-form-item label="用户名">
          <n-input v-model:value="searchParams.userName" placeholder="请输入用户名" />
        </n-form-item>
        
        <n-form-item label="时间范围">
          <n-date-picker
            v-model:value="dateRange"
            type="datetimerange"
            :show-time="true"
            placeholder="请选择时间范围"
            @update:value="handleDateRangeChange"
          />
        </n-form-item>
        
        <n-form-item label="日志级别">
          <n-select
            v-model:value="searchParams.level"
            placeholder="请选择日志级别"
            :options="logLevelOptions"
          />
        </n-form-item>
        
        <n-form-item label="操作类型">
          <n-select
            v-model:value="searchParams.operationType"
            placeholder="请选择操作类型"
            :options="operationTypeOptions"
          />
        </n-form-item>
        
        <n-form-item label="操作结果">
          <n-select
            v-model:value="searchParams.result"
            placeholder="请选择操作结果"
            :options="operationResultOptions"
          />
        </n-form-item>
        
        <n-form-item>
          <n-space>
            <n-button type="primary" @click="handleSearch">查询</n-button>
            <n-button @click="handleReset">重置</n-button>
            <n-dropdown :options="exportOptions">
              <n-button type="success">
                导出
                <template #suffix>
                  <n-icon><ChevronDownOutlined /></n-icon>
                </template>
              </n-button>
            </n-dropdown>
            <n-button type="warning" @click="handleVerifyIntegrity">验证完整性</n-button>
          </n-space>
        </n-form-item>
      </n-form>
      
      <!-- 日志列表 -->
      <n-divider />
      
      <n-table
        ref="tableRef"
        :columns="columns"
        :data="logList"
        :pagination="pagination"
        :row-key="row => row.logId"
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      >
        <template #body-cell="{ column, row }">
          <template v-if="column.key === 'timestamp'">
            <span>{{ formatTimestamp(row.timestamp) }}</span>
          </template>
          <template v-else-if="column.key === 'level'">
            <n-tag :type="getLevelTagType(row.level)">
              {{ row.level }}
            </n-tag>
          </template>
          <template v-else-if="column.key === 'result'">
            <n-tag :type="getResultTagType(row.result)">
              {{ row.result }}
            </n-tag>
          </template>
          <template v-else-if="column.key === 'details'">
            <n-button
              text
              type="primary"
              size="small"
              @click="handleViewDetails(row)"
            >
              查看
            </n-button>
          </template>
        </template>
      </n-table>
      
      <!-- 日志详情抽屉 -->
      <n-drawer
        v-model:show="detailDrawerVisible"
        title="日志详情"
        :width="600"
      >
        <div v-if="selectedLog" class="log-details">
          <n-descriptions :column="1" bordered size="small">
            <n-descriptions-item label="日志ID">{{ selectedLog.logId }}</n-descriptions-item>
            <n-descriptions-item label="用户ID">{{ selectedLog.userId }}</n-descriptions-item>
            <n-descriptions-item label="用户名">{{ selectedLog.userName }}</n-descriptions-item>
            <n-descriptions-item label="操作时间">{{ formatTimestamp(selectedLog.timestamp) }}</n-descriptions-item>
            <n-descriptions-item label="日志级别">{{ selectedLog.level }}</n-descriptions-item>
            <n-descriptions-item label="操作类型">{{ selectedLog.operationType }}</n-descriptions-item>
            <n-descriptions-item label="操作目标">{{ selectedLog.target }}</n-descriptions-item>
            <n-descriptions-item label="客户端IP">{{ selectedLog.clientIp }}</n-descriptions-item>
            <n-descriptions-item label="操作结果">{{ selectedLog.result }}</n-descriptions-item>
            <n-descriptions-item label="操作详情">
              <pre>{{ formatJson(selectedLog.details) }}</pre>
            </n-descriptions-item>
            <n-descriptions-item label="日志哈希">{{ selectedLog.hash }}</n-descriptions-item>
            <n-descriptions-item label="前序哈希">{{ selectedLog.previousHash }}</n-descriptions-item>
          </n-descriptions>
        </div>
      </n-drawer>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ChevronDownOutlined } from '@vicons/antd';
import { useLog } from '@/hooks/business/useLog';

const { searchLogs, exportLogs, verifyLogsIntegrity } = useLog();

// Search form
const searchFormRef = ref();
const searchParams = reactive<Api.Log.LogSearchParams>({
  page: 1,
  pageSize: 10
});

// Date range
const dateRange = ref<[Date | null, Date | null]>([null, null]);

// Pagination
const pagination = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100],
  total: 0
});

// Log list
const logList = ref<Api.Log.LogRecord[]>([]);
const tableRef = ref();

// Log level options
const logLevelOptions = [
  { label: 'INFO', value: 'INFO' },
  { label: 'WARN', value: 'WARN' },
  { label: 'ERROR', value: 'ERROR' },
  { label: 'CRITICAL', value: 'CRITICAL' }
];

// Operation type options
const operationTypeOptions = [
  { label: '登录', value: 'LOGIN' },
  { label: '登出', value: 'LOGOUT' },
  { label: '创建', value: 'CREATE' },
  { label: '读取', value: 'READ' },
  { label: '更新', value: 'UPDATE' },
  { label: '删除', value: 'DELETE' },
  { label: '权限变更', value: 'PERMISSION_CHANGE' },
  { label: '配置修改', value: 'CONFIG_CHANGE' },
  { label: '敏感数据访问', value: 'SENSITIVE_ACCESS' }
];

// Operation result options
const operationResultOptions = [
  { label: '成功', value: 'SUCCESS' },
  { label: '失败', value: 'FAILED' },
  { label: '部分成功', value: 'PARTIAL_SUCCESS' }
];

// Export options
const exportOptions = [
  { label: '导出为CSV', key: 'CSV' },
  { label: '导出为Excel', key: 'EXCEL' },
  { label: '导出为PDF', key: 'PDF' }
].map(item => ({
  ...item,
  onClick: () => handleExport(item.key as any)
}));

// Log details drawer
const detailDrawerVisible = ref(false);
const selectedLog = ref<Api.Log.LogRecord | null>(null);

// Table columns
const columns = [
  { title: '日志ID', key: 'logId', width: 180 },
  { title: '用户ID', key: 'userId', width: 120 },
  { title: '用户名', key: 'userName', width: 120 },
  { title: '操作时间', key: 'timestamp', width: 180 },
  { title: '日志级别', key: 'level', width: 100 },
  { title: '操作类型', key: 'operationType', width: 120 },
  { title: '操作目标', key: 'target', width: 150 },
  { title: '客户端IP', key: 'clientIp', width: 120 },
  { title: '操作结果', key: 'result', width: 100 },
  { title: '操作详情', key: 'details', width: 100 },
  { title: '日志哈希', key: 'hash', width: 320 }
];

// Format timestamp
function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toISOString().replace('T', ' ').substring(0, 23);
}

// Get level tag type
function getLevelTagType(level: Api.Log.LogLevel): string {
  const typeMap: Record<Api.Log.LogLevel, string> = {
    INFO: 'info',
    WARN: 'warning',
    ERROR: 'error',
    CRITICAL: 'error'
  };
  return typeMap[level] || 'info';
}

// Get result tag type
function getResultTagType(result: Api.Log.OperationResult): string {
  const typeMap: Record<Api.Log.OperationResult, string> = {
    SUCCESS: 'success',
    FAILED: 'error',
    PARTIAL_SUCCESS: 'warning'
  };
  return typeMap[result] || 'info';
}

// Handle date range change
function handleDateRangeChange(range: [Date | null, Date | null]) {
  if (range[0] && range[1]) {
    searchParams.startTime = range[0].getTime();
    searchParams.endTime = range[1].getTime();
  } else {
    delete searchParams.startTime;
    delete searchParams.endTime;
  }
}

// Handle search
async function handleSearch() {
  try {
    const result = await searchLogs(searchParams);
    logList.value = result.list;
    pagination.total = result.total;
  } catch (error) {
    window.$notification?.error({
      title: '查询失败',
      content: (error as Error).message
    });
  }
}

// Handle reset
function handleReset() {
  // Reset form
  Object.assign(searchParams, {
    userId: undefined,
    userName: undefined,
    level: undefined,
    operationType: undefined,
    result: undefined,
    page: 1,
    pageSize: 10
  });
  dateRange.value = [null, null];
  delete searchParams.startTime;
  delete searchParams.endTime;
  
  // Refresh data
  handleSearch();
}

// Handle page change
function handlePageChange(page: number) {
  searchParams.page = page;
  handleSearch();
}

// Handle page size change
function handlePageSizeChange(pageSize: number) {
  searchParams.pageSize = pageSize;
  handleSearch();
}

// Handle export
async function handleExport(format: 'CSV' | 'EXCEL' | 'PDF') {
  try {
    const exportParams: Api.Log.LogExportParams = {
      format,
      searchParams: { ...searchParams }
    };
    
    const result = await exportLogs(exportParams);
    
    // Download file
    const a = document.createElement('a');
    a.href = result.fileUrl;
    a.download = result.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Revoke blob URL
    URL.revokeObjectURL(result.fileUrl);
    
    window.$notification?.success({
      title: '导出成功',
      content: `日志已导出为${format}格式，文件名为：${result.fileName}`
    });
  } catch (error) {
    window.$notification?.error({
      title: '导出失败',
      content: (error as Error).message
    });
  }
}

// Handle verify integrity
async function handleVerifyIntegrity() {
  try {
    const result = await verifyLogsIntegrity();
    if (result) {
      window.$notification?.success({
        title: '验证成功',
        content: '日志数据完整，未被篡改'
      });
    } else {
      window.$notification?.error({
        title: '验证失败',
        content: '日志数据可能已被篡改，请检查'
      });
    }
  } catch (error) {
    window.$notification?.error({
      title: '验证失败',
      content: (error as Error).message
    });
  }
}

// Handle view details
function handleViewDetails(row: Api.Log.LogRecord) {
  selectedLog.value = row;
  detailDrawerVisible.value = true;
}

// Format JSON
function formatJson(jsonStr: string): string {
  try {
    const jsonObj = JSON.parse(jsonStr);
    return JSON.stringify(jsonObj, null, 2);
  } catch {
    return jsonStr;
  }
}

// Initialize data
onMounted(() => {
  handleSearch();
});
</script>

<style scoped lang="scss">
.log-management-page {
  padding: 16px;
}

.page-card {
  margin-bottom: 16px;
}

.search-form {
  margin-bottom: 16px;
}

.log-details {
  max-height: 600px;
  overflow-y: auto;
  
  pre {
    background-color: #f5f5f5;
    padding: 8px;
    border-radius: 4px;
    overflow-x: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}
</style>
