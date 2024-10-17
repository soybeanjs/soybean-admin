import { createAlovaRequest } from '@sa/alova';
import { createAlovaMockAdapter } from '@sa/alova/mock';
import adapterFetch from '@sa/alova/fetch';
import { useAuthStore } from '@/store/modules/auth';
import { $t } from '@/locales';
import { getServiceBaseURL } from '@/utils/service';
import featureUsers20241014 from '../mocks/feature-users-20241014';
import { getAuthorization, handleRefreshToken, showErrorMsg } from './shared';
import type { RequestInstanceState } from './type';

const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';
const { baseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);

const state: RequestInstanceState = {
  errMsgStack: []
};
const mockAdapter = createAlovaMockAdapter([featureUsers20241014], {
  // using requestAdapter if not match mock request
  httpAdapter: adapterFetch(),

  // response delay time
  delay: 1000,

  // global mock toggle
  enable: true,
  matchMode: 'methodurl'
});
export const alova = createAlovaRequest(
  {
    baseURL,
    requestAdapter: import.meta.env.DEV ? mockAdapter : adapterFetch()
  },
  {
    onRequest({ config }) {
      const Authorization = getAuthorization();
      config.headers.Authorization = Authorization;
      config.headers.apifoxToken = 'XL299LiMEDZ0H5h3A29PxwQXdMJqWyY2';
    },
    tokenRefresher: {
      async isExpired(response) {
        const expiredTokenCodes = import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',') || [];
        const { code } = await response.clone().json();
        return expiredTokenCodes.includes(String(code));
      },
      async handler() {
        await handleRefreshToken();
      }
    },
    async isBackendSuccess(response) {
      // when the backend response code is "0000"(default), it means the request is success
      // to change this logic by yourself, you can modify the `VITE_SERVICE_SUCCESS_CODE` in `.env` file
      const resp = response.clone();
      const data = await resp.json();
      return String(data.code) === import.meta.env.VITE_SERVICE_SUCCESS_CODE;
    },
    async transformBackendResponse(response) {
      return (await response.clone().json()).data;
    },
    async onError(error, response) {
      const authStore = useAuthStore();

      let message = error.message;
      let responseCode = '';
      if (response) {
        const data = await response?.clone().json();
        message = data.msg;
        responseCode = String(data.code);
      }

      function handleLogout() {
        showErrorMsg(state, message);
        authStore.resetStore();
      }

      function logoutAndCleanup() {
        handleLogout();
        window.removeEventListener('beforeunload', handleLogout);
        state.errMsgStack = state.errMsgStack.filter(msg => msg !== message);
      }

      // when the backend response code is in `logoutCodes`, it means the user will be logged out and redirected to login page
      const logoutCodes = import.meta.env.VITE_SERVICE_LOGOUT_CODES?.split(',') || [];
      if (logoutCodes.includes(responseCode)) {
        handleLogout();
        throw error;
      }

      // when the backend response code is in `modalLogoutCodes`, it means the user will be logged out by displaying a modal
      const modalLogoutCodes = import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || [];
      if (modalLogoutCodes.includes(responseCode) && !state.errMsgStack?.includes(message)) {
        state.errMsgStack = [...(state.errMsgStack || []), message];

        // prevent the user from refreshing the page
        window.addEventListener('beforeunload', handleLogout);

        window.$dialog?.error({
          title: $t('common.error'),
          content: message,
          positiveText: $t('common.confirm'),
          maskClosable: false,
          closeOnEsc: false,
          onPositiveClick() {
            logoutAndCleanup();
          },
          onClose() {
            logoutAndCleanup();
          }
        });
        throw error;
      }
      showErrorMsg(state, message);
      throw error;
    }
  }
);
