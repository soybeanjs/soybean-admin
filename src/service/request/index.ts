import { REQUEST_TIMEOUT } from '@/config';
import { createRequest } from './request';

export const request = createRequest({
  baseURL: import.meta.env.VITE_HTTP_URL,
  timeout: REQUEST_TIMEOUT
});
