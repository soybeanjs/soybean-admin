import { createRequest } from './request';
import { serviceEnv } from '~/.env-config';

const env = import.meta.env.VITE_HTTP_ENV || 'test';

const { url } = serviceEnv[env];

export const request = createRequest({ baseURL: url });

export const mockRequest = createRequest({ baseURL: '/mock' });
