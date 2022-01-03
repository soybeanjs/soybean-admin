import { createRequest } from './request';
import { serviceEnv } from '~/.env-config';

const { url } = serviceEnv[import.meta.env.VITE_HTTP_ENV];

export const request = createRequest({ baseURL: url });

export const mockRequest = createRequest({ baseURL: '/mock' });
