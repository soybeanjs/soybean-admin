import { createRequest } from './axios';
import { REQUEST_TIMEOUT } from './config';

export const request = createRequest({
  baseURL: import.meta.env.VITE_HTTP_URL,
  timeout: REQUEST_TIMEOUT
});

export { resultMiddleware } from './helpers';
