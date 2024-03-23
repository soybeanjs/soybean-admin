import type { AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/modules/auth';
import { localStg } from '@/utils/storage';
import { fetchRefreshToken } from '../api';

/**
 * refresh token
 *
 * @param axiosConfig - request config when the token is expired
 */
export async function handleRefreshToken(axiosConfig: AxiosRequestConfig) {
  const { resetStore } = useAuthStore();

  const refreshToken = localStg.get('refreshToken') || '';
  const { error, data } = await fetchRefreshToken(refreshToken);
  if (!error) {
    localStg.set('token', data.token);
    localStg.set('refreshToken', data.refreshToken);

    const config = { ...axiosConfig };
    if (config.headers) {
      config.headers.Authorization = data.token;
    }

    return config;
  }

  resetStore();

  return null;
}
