import type {
  AlovaGenerics,
  AlovaOptions,
  AlovaRequestAdapter,
  Method,
  ResponseCompleteHandler,
  ResponseErrorHandler
} from 'alova';

export type CustomAlovaConfig<AG extends AlovaGenerics> = Omit<
  AlovaOptions<AG>,
  'statesHook' | 'beforeRequest' | 'responded' | 'requestAdapter'
> & {
  /** expired token codes */
  expiredTokenCodes: string[];
  /** request adapter. all request of alova will be sent by it. */
  requestAdapter?: AlovaRequestAdapter<AG['RequestConfig'], AG['Response'], AG['ResponseHeader']>;
};

export interface RequestOptions<AG extends AlovaGenerics> {
  /**
   * The hook before request
   *
   * For example: You can add header token in this hook
   *
   * @param method alova Method Instance
   */
  onRequest?: (method: Method<AG>) => void | Promise<void>;
  /**
   * The hook to check backend response is success or not
   *
   * @param response Axios response
   */
  isBackendSuccess?: (response: Response) => Promise<boolean>;

  /** The hook to refresh token */
  refreshTokenHandler?: () => Promise<void>;
  /**
   * The hook after backend request fail
   *
   * For example: You can handle the expired token in this hook
   *
   * @param response Axios response
   * @param instance Axios instance
   */
  onBackendFail?: (response: Response) => Promise<Response | null> | Promise<void>;

  onComplete?: ResponseCompleteHandler<AG>;

  /**
   * The hook to handle error
   *
   * For example: You can show error message in this hook
   *
   * @param error
   */
  onError?: ResponseErrorHandler<AG>;
  /**
   * transform backend response when the responseType is json
   *
   * @param response Axios response
   */
  transformBackendResponse?: (response: AG['Response']) => any | Promise<any>;
}
