import { getServiceEnvConfig } from '~/.env-config';
import { createRequest } from './request';

const { pattern, url, secondUrl } = getServiceEnvConfig(import.meta.env);

const isHttpProxy = import.meta.env.VITE_HTTP_PROXY === 'Y';

export const request = createRequest({ baseURL: isHttpProxy ? pattern : url });

export const secondRequest = createRequest({ baseURL: isHttpProxy ? pattern : secondUrl });

export const mockRequest = createRequest({ baseURL: '/mock' });
