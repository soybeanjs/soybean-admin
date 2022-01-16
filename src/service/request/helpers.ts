import type { AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store';
import { getRefreshToken, setToken, setRefreshToken } from '@/utils';
import { fetchUpdateToken } from '../api';

/**
 * 刷新token
 * @param axiosConfig - token失效时的请求配置
 */
export async function refreshToken(axiosConfig: AxiosRequestConfig) {
  const { resetAuthStore } = useAuthStore();
  const refreshToken = getRefreshToken();
  const { data } = await fetchUpdateToken(refreshToken);
  if (data) {
    setToken(data.token);
    setRefreshToken(data.refreshToken);
    const config = { ...axiosConfig };
    if (config.headers) {
      config.headers.Authorization = data.token;
    }
    return config;
  }

  resetAuthStore();
  return null;
}
