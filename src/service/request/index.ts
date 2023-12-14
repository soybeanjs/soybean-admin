import { createOfetch as createRequest } from '@sa/request';
import { localStg } from '@/utils/storage';
import { createProxyPattern, createServiceConfig } from '~/env.config';

const { baseURL, otherBaseURL } = createServiceConfig(import.meta.env);

const isHttpProxy = import.meta.env.VITE_HTTP_PROXY === 'Y';

export const request = createRequest({
  baseURL: isHttpProxy ? createProxyPattern() : baseURL,
  headers: {
    apifoxToken: 'XL299LiMEDZ0H5h3A29PxwQXdMJqWyY2'
  },
  onRequest({ options }) {
    if (options.headers) {
      const token = localStg.get('token');

      const Authorization = token ? `Bearer ${token}` : '';

      Object.assign(options.headers, { Authorization });
    }
  }
});

export const demoRequest = createRequest({ baseURL: isHttpProxy ? createProxyPattern('demo') : otherBaseURL.demo });
