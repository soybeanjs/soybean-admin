import { createRequest } from './request';
import { REQUEST_TIMEOUT } from './config';

export const adminRequest = createRequest({
  baseURL: import.meta.env.VITE_HTTP_URL_EMOSS_ADMIN as string,
  timeout: REQUEST_TIMEOUT
});
