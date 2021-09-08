import { createRequest } from './request';

export const adminRequest = createRequest({
  baseURL: import.meta.env.VITE_HTTP_URL_EMOSS_ADMIN as string
});
