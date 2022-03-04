import { createRequest } from './request';
import { serviceEnv } from '~/.env-config';

const { VITE_HTTP_ENV = 'test' } = import.meta.env;

const { url } = serviceEnv[VITE_HTTP_ENV];

export const request = createRequest({ baseURL: url });

export const mockRequest = createRequest({ baseURL: '/mock' });
