<script lang="tsx" setup>
import { NTime } from 'naive-ui';
import { useLoading } from '@sa/hooks';
import { fetchForceLogout, fetchGetOnlineDeviceList } from '@/service/api/system/user';
import { useAppStore } from '@/store/modules/app';
import { useNaiveTable } from '@/hooks/common/table';
import { getBrowserIcon, getOsIcon } from '@/utils/icon';
import { $t } from '@/locales';

defineOptions({
  name: 'OnlineTable'
});

const appStore = useAppStore();
const { loading: btnLoading, startLoading: startBtnLoading, endLoading: endBtnLoading } = useLoading(false);

const {
  columns: tableColumns,
  data,
  loading,
  getData
} = useNaiveTable({
  api: () => fetchGetOnlineDeviceList(),
  transform: response => {
    const { data: list, error } = response;
    if (!error) {
      return list.records;
    }
    return [];
  },
  columns: () => [
    { title: '设备类型', key: 'deviceType', align: 'center', minWidth: 120 },
    { title: 'IP地址', key: 'ipaddr', align: 'center', minWidth: 120 },
    { title: '登录地点', key: 'loginLocation', align: 'center', minWidth: 120 },
    {
      title: '浏览器',
      key: 'browser',
      align: 'center',
      minWidth: 120,
      render: row => {
        return (
          <div class="flex items-center justify-center gap-2">
            <SvgIcon icon={getBrowserIcon(row.browser)} />
            {row.browser}
          </div>
        );
      }
    },
    {
      title: '操作系统',
      key: 'os',
      align: 'center',
      minWidth: 120,
      render: row => {
        const osName = row.os?.split(' or ')[0] ?? '';
        return (
          <div class="flex items-center justify-center gap-2">
            <SvgIcon icon={getOsIcon(osName)} />
            {osName}
          </div>
        );
      }
    },
    {
      title: '登录时间',
      key: 'loginTime',
      align: 'center',
      minWidth: 180,
      render: row => <NTime time={row.loginTime} format="yyyy-MM-dd HH:mm:ss" />
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      minWidth: 80,
      render: row => {
        return (
          <div class="flex-center gap-8px">
            <ButtonIcon
              text
              type="error"
              icon="material-symbols:delete-outline"
              loading={btnLoading.value}
              class="text-18px"
              tooltipContent="强制下线"
              popconfirmContent="确定强制下线吗？"
              onPositiveClick={() => forceLogout(row.tokenId)}
            />
          </div>
        );
      }
    }
  ]
});

/** 强制下线 */
async function forceLogout(tokenId: string) {
  startBtnLoading();
  const { error } = await fetchForceLogout(tokenId);
  if (!error) {
    window.$message?.success('强制下线成功');
    await getData();
  }
  endBtnLoading();
}

getData();
</script>

<template>
  <NDataTable
    :columns="tableColumns"
    :data="data"
    size="small"
    :flex-height="!appStore.isMobile"
    :scroll-x="962"
    :loading="loading"
    remote
    :row-key="row => row.noticeId"
    class="h-full"
  />
</template>
