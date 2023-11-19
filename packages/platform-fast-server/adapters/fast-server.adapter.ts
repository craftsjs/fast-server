import { IFastServer, IRequest, IResponse, fastServer, ServeStaticOptions } from '@craftsjs/fast-server';
import {
  HttpStatus,
  Logger,
  NestApplicationOptions,
  RequestMethod,
  StreamableFile,
} from '@nestjs/common';
import { CorsOptions, CorsOptionsDelegate } from '@nestjs/common/interfaces/external/cors-options.interface';
import { isFunction, isNil, isObject, isString } from './utils/shared.utils';
import { RouterMethodFactory } from './helpers/router-method-factory';
import cors from 'cors';
import { Server } from 'bun';
import { UriVersioningHandler } from './version-filter/chain/uri-version-handler';
import { CustomVersioningHandler } from './version-filter/chain/custom-version-handler';
import { MediaTypeVersioningHandler } from './version-filter/chain/media-type-version-handler';
import { HeaderVersioningHandler } from './version-filter/chain/header-version-handler';
import { AbstractHttpAdapter } from '@nestjs/core/adapters/http-adapter';

type VersionedRoute = <
  TRequest extends Record<string, any> = any,
  TResponse = any,
>(
  req: TRequest,
  res: TResponse,
  next: () => void,
) => any;

export class FastServerAdapter<
  TServer extends IFastServer = any,
  TRequest extends IRequest = any,
  TResponse extends IResponse = any> extends AbstractHttpAdapter<TServer, TRequest, TResponse>{

  logger = new Logger(FastServerAdapter.name);

  private readonly routerMethodFactory = new RouterMethodFactory();

  constructor(instance?: any) {
    super(instance || fastServer());
  }

  reply(response: IResponse, body: any, statusCode?: number | undefined) {
    if (statusCode) {
      response.status(statusCode);
    }

    if (isNil(body)) {
      return response.end();
    }

    if (body instanceof StreamableFile) {
      return this.handleStreamableFile(response, body);
    }

    this.ensureContentType(response, body);
    return this.sendResponse(response, body);
  }

  private handleStreamableFile(response: IResponse, body: StreamableFile): Response {
    const streamHeaders = body.getHeaders();
    this.setHeadersIfUndefined(response, streamHeaders);
    return response.send(body);
  }

  private setHeadersIfUndefined(response: IResponse, headers: any) {
    ['Type', 'Disposition', 'Length'].forEach(header => {
      const headerContent = `Content-${header}`;
      const headerKey = header.toLowerCase();
      if (response.getHeader(headerContent) === undefined && headers[headerKey] !== undefined) {
        response.setHeader(headerContent, headers[headerKey]);
      }
    });
  }

  private ensureContentType(response: IResponse, body: any) {
    const responseContentType = response.getHeader('Content-Type');
    if (typeof responseContentType === 'string' &&
      !responseContentType.startsWith('application/json') &&
      body?.statusCode >= HttpStatus.BAD_REQUEST) {
      this.logger.warn(
        'Content-Type doesn\'t match Reply body, you might need a custom ExceptionFilter for non-JSON responses',
      );
      response.setHeader('Content-Type', 'application/json');
    }
  }

  private sendResponse(response: IResponse, body: any): Response {
    return isObject(body) ? response.json(body) : response.send(String(body));
  }

  public listen(port: string | number, callback?: () => void): Server;
  public listen(
    port: string | number,
    hostname: string,
    callback?: () => void,
  ): Server;
  public listen(port: any, hostOrCallback?: string | (() => void), callback?: () => void): Server {
    let host = '';
    if (isString(hostOrCallback)) {
      host = hostOrCallback as string;
    }
    const server = this.instance.listen({
      port,
      hostname: host
    });
    if (isFunction(hostOrCallback)) {
      hostOrCallback();
    }
    if (callback) {
      callback();
    }
    return server;
  }

  status(response: IResponse, statusCode: number) {
    return response.status(statusCode);
  }

  end(response: IResponse, message?: string | undefined) {
    return response.end(message);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setErrorHandler(handler: Function, prefix?: string) {
    this.use(handler);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setNotFoundHandler(handler: Function, prefix?: string) {
    this.instance.setNotFoundHandler(handler);
  }

  setHeader(response: IResponse, name: string, value: string) {
    return response.setHeader(name, value);
  }

  isHeadersSent(response: IResponse) {
    return response.isReady();
  }

  close() {
    this.httpServer.close();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initHttpServer(options: NestApplicationOptions) {
    this.httpServer = this.instance as TServer;
  }

  getRequestHostname(request: IRequest) {
    return request.hostname;
  }

  getRequestMethod(request: IRequest) {
    return request.method;
  }

  getRequestUrl(request: IRequest) {
    return request.originalUrl;
  }

  getType(): string {
    return 'fast-server'
  }

  createMiddlewareFactory(requestMethod: RequestMethod):
  ((path: string, callback: Function) => any) | Promise<(path: string, callback: Function) => any> {
    return this.routerMethodFactory
      .get(this.instance, requestMethod)
      .bind(this.instance);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  enableCors(options: CorsOptions | CorsOptionsDelegate<IRequest>, prefix?: string) {
    return this.use(cors(options));
  }

  public applyVersionFilter(
    handler: Function,
    version: any,
    versioningOptions: any,
  ): VersionedRoute {
    const uriHandler = new UriVersioningHandler();
    const customHandler = new CustomVersioningHandler();
    const mediaTypeHandler = new MediaTypeVersioningHandler();
    const headerHandler = new HeaderVersioningHandler();

    uriHandler.setNext(customHandler);
    customHandler.setNext(mediaTypeHandler);
    mediaTypeHandler.setNext(headerHandler);

    return (req, res, next) => uriHandler.handle(req, res, next, version, versioningOptions, handler);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  registerParserMiddleware(prefix?: string, rawBody?: boolean) {
    this.logger.warn('You don\'t need body-parser for fast server');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(response: IResponse, view: string, options: any) {
    return response.send(view);
  }

  async useStaticAssets(path: string, options: ServeStaticOptions) {
    if (options && options.prefix) {
      return this.use(options.prefix, await this.instance.static(path, options));
    }
    return this.use(this.instance.static(path, options));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  redirect(response: any, statusCode: number, url: string) {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setViewEngine(engine: string) {
    throw new Error('Method not implemented.');
  }
}
