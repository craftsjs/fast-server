import { IResponse } from './interfaces/response.interface';

export class BunResponse implements IResponse {

  private response: Response | undefined;
  private options: ResponseInit = {};

  status(code: number): IResponse {
    this.options.status = code;
    return this;
  }

  option(option: ResponseInit): IResponse {
    this.options = Object.assign(this.options, option);
    return this;
  }

  statusText(text: string): IResponse {
    this.options.statusText = text;
    return this;
  }

  json(body: any): Response {
    this.response = Response.json(body, this.options);
    return this.response;
  }

  send(body: any): Response {
    this.response = new Response(body, this.options);
    return this.response;
  }

  end(): Response {
    this.response = new Response();
    return this.response;
  } 

  setHeader<T>(key: string, value: T): IResponse {
    if (!key || !value) {
      throw new Error('Headers key or value should not be empty');
    }
    
    this.options.headers = Object.assign(this.options.headers || {}, { [key]: value });
    return this;
  }

  getHeaders(): HeadersInit | undefined {
    return this.options.headers;
  }

  setHeaders(header: HeadersInit): IResponse {
    this.options.headers = header;
    return this;
  }

  getResponse(): Response {
    return this.response || {} as any;
  }

  getOptions() {
    return this.options;
  }

  isReady(): boolean {
    return !!this.response;
  }

}