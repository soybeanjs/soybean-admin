import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export type ContentType =
  | 'text/html'
  | 'text/plain'
  | 'multipart/form-data'
  | 'application/json'
  | 'application/x-www-form-urlencoded'
  | 'application/octet-stream';

export type ResponseTransform<Input = any, Output = any> = (input: Input) => Output | Promise<Output>;

export interface RequestOption<
  ResponseData,
  ApiData = ResponseData,
  State extends Record<string, unknown> = Record<string, unknown>
> {
  /**
   * The default state
   */
  defaultState?: State;
  /**
   * transform the response data to the api data
   *
   * @param response Axios response
   */
  transform: ResponseTransform<AxiosResponse<ResponseData>, ApiData>;
  /**
   * transform the response data to the api data
   *
   * @deprecated use `transform` instead, will be removed in the next major version v3
   * @param response Axios response
   */
  transformBackendResponse: ResponseTransform<AxiosResponse<ResponseData>, ApiData>;
  /**
   * The hook before request
   *
   * For example: You can add header token in this hook
   *
   * @param config Axios config
   */
  onRequest: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
  /**
   * The hook to check backend response is success or not
   *
   * @param response Axios response
   */
  isBackendSuccess: (response: AxiosResponse<ResponseData>) => boolean;
  /**
   * The hook after backend request fail
   *
   * For example: You can handle the expired token in this hook
   *
   * @param response Axios response
   * @param instance Axios instance
   */
  onBackendFail: (
    response: AxiosResponse<ResponseData>,
    instance: AxiosInstance
  ) => Promise<AxiosResponse | null> | Promise<void>;
  /**
   * The hook to handle error
   *
   * For example: You can show error message in this hook
   *
   * @param error
   */
  onError: (error: AxiosError<ResponseData>) => void | Promise<void>;
}

interface ResponseMap {
  blob: Blob;
  text: string;
  arrayBuffer: ArrayBuffer;
  stream: ReadableStream<Uint8Array>;
  document: Document;
}
export type ResponseType = keyof ResponseMap | 'json';

export type MappedType<R extends ResponseType, JsonType = any> = R extends keyof ResponseMap
  ? ResponseMap[R]
  : JsonType;

export type CustomAxiosRequestConfig<R extends ResponseType = 'json'> = Omit<AxiosRequestConfig, 'responseType'> & {
  responseType?: R;
};

export interface RequestInstanceCommon<State extends Record<string, unknown>> {
  /**
   * cancel all request
   *
   * if the request provide abort controller sign from config, it will not collect in the abort controller map
   */
  cancelAllRequest: () => void;
  /** you can set custom state in the request instance */
  state: State;
}

/** The request instance */
export interface RequestInstance<ApiData, State extends Record<string, unknown>> extends RequestInstanceCommon<State> {
  <T extends ApiData = ApiData, R extends ResponseType = 'json'>(
    config: CustomAxiosRequestConfig<R>
  ): Promise<MappedType<R, T>>;
}

export type FlatResponseSuccessData<ResponseData, ApiData> = {
  data: ApiData;
  error: null;
  response: AxiosResponse<ResponseData>;
};

export type FlatResponseFailData<ResponseData> = {
  data: null;
  error: AxiosError<ResponseData>;
  response: AxiosResponse<ResponseData>;
};

export type FlatResponseData<ResponseData, ApiData> =
  | FlatResponseSuccessData<ResponseData, ApiData>
  | FlatResponseFailData<ResponseData>;

export interface FlatRequestInstance<
  ResponseData,
  ApiData,
  State extends Record<string, unknown>
> extends RequestInstanceCommon<State> {
  <T extends ApiData = ApiData, R extends ResponseType = 'json'>(
    config: CustomAxiosRequestConfig<R>
  ): Promise<FlatResponseData<ResponseData, MappedType<R, T>>>;
}
