export interface IResponse {
  status(code: number): IResponse;
  statusText(text: string): IResponse;
  option(option: ResponseInit): IResponse;
  json<T>(body: T): Response;
  send<T>(body: T): Response;
  end(): Response;
  setHeader<T>(key: string, value: T): IResponse;
  getHeaders(): HeadersInit | undefined;
  setHeaders(header: HeadersInit): IResponse;
  getResponse(): Response;
  isReady(): boolean;
}