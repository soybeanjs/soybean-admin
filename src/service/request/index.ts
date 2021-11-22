import { createRequest } from './axios';
import { REQUEST_TIMEOUT, REQUEST_TIMEOUT_MSG } from './config';

export const request = createRequest({
  baseURL: import.meta.env.VITE_HTTP_URL,
  timeout: REQUEST_TIMEOUT,
  timeoutErrorMessage: REQUEST_TIMEOUT_MSG
});
