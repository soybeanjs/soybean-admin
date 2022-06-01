import { getEnvConfig } from '~/.env-config';
import { createRequest } from './request';

const envConfig = getEnvConfig(import.meta.env);
const isHttpProxy = import.meta.env.VITE_HTTP_PROXY === 'true';

export const request = createRequest({ baseURL: isHttpProxy ? envConfig.proxy : envConfig.url });

export const mockRequest = createRequest({ baseURL: '/mock' });
