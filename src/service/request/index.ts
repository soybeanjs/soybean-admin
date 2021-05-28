import { createRequest } from './request';
import { REQUEST_TIMEOUT, ContentType } from './config';

export { handleResponse } from './request';
export { ContentType };

// emoss-admin
export const adminRequest = createRequest({
  baseURL: import.meta.env.VITE_HTTP_URL_EMOSS_ADMIN as string,
  timeout: REQUEST_TIMEOUT
});
