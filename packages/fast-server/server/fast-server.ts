import { Server } from 'bun';
import { FastServerOptions } from './interfaces/server-options.interface';
import { IFastServer } from './interfaces/fast-server.interface';
import { ErrorHandler, Handler, Middleware } from './types/handler.type';
import { EndpointManager, EndpointMatch } from './endpoint-manager';
import { IRequest } from './interfaces/request.interface';
import { BunResponse } from './response';
import { Chain } from './chain';
import { IResponse } from './interfaces/response.interface';
import { HttpStatusCode } from './enums/http-status-code.enum';
import { AbstractServer } from './abstract-server';
import { Router } from './router';
import { IRouter } from './interfaces/router.interface';
import { EventCallback, EventEmitter } from './utils/event-emiter.util';
import { join, sep } from 'path';
import { readdir } from 'fs';

export function fastServer() {
  return FastServer.instance;
}

class FastServer extends AbstractServer implements IFastServer {

  protected notFoundHandler: Handler | undefined;

  private globalMiddlewares: Middleware[] = [];

  private static server?: FastServer;

  private readonly errorHandlers: ErrorHandler[] = [];

  private emitter = new EventEmitter();

  public bunServer: Server | undefined;

  private constructor() {
    super();
    if (FastServer.server) {
      throw new Error(
        'DONT use this constructor to create fast server, try Server()'
      );
    }
    FastServer.server = this;
  }

  static get instance(): IFastServer {
    return FastServer.server ?? (FastServer.server = new FastServer());
  }

  setNotFoundHandler(handler: Handler) {
    this.notFoundHandler = handler;
  }

  async static(path: string): Promise<IRouter> {
    return new Promise((resolve, reject) => {
      const router = this.router();
      readdir(path, { encoding: 'utf8' }, (err, files: string[]) => {
        if (err) {
          reject(err);
        }
        files.forEach(filePath => {
          //convert filePath to router
          const normalizedRoutePath = '/' + filePath.split(sep).join('/');
          router.get(normalizedRoutePath, (_, res) => {
            const file = Bun.file(join(path, filePath));
            res.send(file);
          })
        });
        resolve(router);
      });
    })

  }

  use(middleware: Middleware): void;
  use(errorHandler: ErrorHandler): void;
  use(path: string, middleware: Middleware): void;
  use(path: string, router: Router): void;
  use(arg1: string | Middleware | ErrorHandler, arg2?: Router | Middleware) {
    if (typeof arg1 === 'string') {
      this.handleStringArg(arg1, arg2);
    } else {
      this.handleMiddlewareArg(arg1);
    }
  }

  private handleStringArg(arg1: string, arg2?: Router | Middleware | ErrorHandler) {
    if (!arg2) {
      throw new Error('When the first argument is a string, a second argument is expected.');
    }

    if (this.isRouter(arg2)) {
      arg2.attach(arg1, this.requestMethods);
    } else if (this.isMiddleware(arg2)) {
      this.all(arg1, arg2);
    } else {
      throw new Error('Invalid second argument. Expected a Router or Middleware.');
    }
  }

  private handleMiddlewareArg(middleware: Middleware | ErrorHandler) {
    if (middleware.length === 3) {
      this.globalMiddlewares.push(middleware as Middleware)
    } else if (middleware.length === 4) {
      this.errorHandlers.push(middleware as ErrorHandler);
    } else {
      throw new Error('Invalid middleware function.');
    }
  }

  private isRouter(arg: any): arg is Router {
    return arg && typeof arg.attach === 'function';
  }

  private isMiddleware(arg: any): arg is Middleware {
    return typeof arg === 'function' && arg.length === 3;
  }

  addEndpoint(method: string, path: string, handler: Handler, middlewares: Middleware[]) {
    const endpointManager: EndpointManager = this.requestMethods[method];
    endpointManager.addEndpoint(path, handler, middlewares);
  }

  router(): IRouter {
    return new Router();
  }

  address() {
    return this.bunServer?.hostname;
  }

  once(type: string, callback: EventCallback) {
    this.emitter.once(type, callback);
  }

  removeListener(type: string, callback: EventCallback) {
    this.emitter.removeListener(type, callback);
  }

  listen<T>(serverOptions?: FastServerOptions<T>): Server {
    const that = this;
    this.bunServer = Bun.serve({
      ...serverOptions,
      async fetch(req) {
        const response = that.responseProxy();
        const { request, endpointMatch, endpointAllMatch } = await that.resolveRequest(req);

        //get global middlewares
        const globalMiddlewares: Middleware[] = [...that.globalMiddlewares];
        if (endpointAllMatch) {
          for (let index = 0; index < endpointAllMatch.length; index++) {
            const element = endpointAllMatch[index];
            globalMiddlewares.push(element.handler);
          }
        }

        //execute globals and router middlewares
        const middlewares = globalMiddlewares.concat(endpointMatch?.middlewares || []);
        const chain = new Chain();
        chain.add(middlewares || []);
        await chain.executeChain(request, response);

        if (response.isReady()) return response.getResponse();

        //call last handler
        if (!endpointMatch) {
          await that.executeNotFoundHandler(request, response);
          return response.getResponse();
        }
        const handler = endpointMatch.handler as Handler;
        await handler(request, response);

        if (!response.isReady()) {
          return new BunResponse()
            .status(HttpStatusCode.NOT_IMPLEMENTED)
            .json({ status: HttpStatusCode.NOT_IMPLEMENTED, message: 'Method not implemented. Are you sure call send or json?' })
        }
        return response.getResponse();
      },
      error(err: Error) {
        const res = that.responseProxy();
        const next = () => { };

        that.errorHandlers.forEach(async (handler) => {
          await handler.apply(that, [null, res, err, next]);
        });

        that.emitter.emit('error', err);

        if (res.isReady()) {
          return res.getResponse();
        }
      },
    })
    return this.bunServer;
  }

  async executeNotFoundHandler(request: IRequest, response: IResponse) {
    if (this.notFoundHandler) {
      return await this.notFoundHandler(request, response);
    }
    return response
      .status(HttpStatusCode.NOT_FOUND)
      .json({ status: HttpStatusCode.NOT_FOUND, message: 'Router not found' })
  }

  private async resolveRequest(req: Request): Promise<{ request: IRequest, endpointMatch: EndpointMatch | undefined, endpointAllMatch: EndpointMatch[] | undefined }> {
    const url = new URL(req.url);
    const request: IRequest = {
      method: req.method,
      originalUrl: req.url,
      path: url.pathname,
      body: req.json(),
      headers: req.headers.toJSON(),
      params: {},
      query: url.searchParams,
      request: req,
      formData: req.formData,
      hostname: url.hostname
    }
    const endpointManager = this.requestMethods[request.method] as EndpointManager;
    if (!endpointManager) {
      return { request, endpointMatch: undefined, endpointAllMatch: undefined }
    }
    const path = request.path
      .replace(/\/$/, '');
    const endpointMatch = endpointManager.matchEndpoint(path);
    const endpointAllMatch = this.requestMethods.ALL?.matchAllEndpoint(path);
    request.params = endpointMatch?.params || {};
    request.endPointPath = endpointMatch?.path;
    return { request, endpointMatch, endpointAllMatch };
  }

  private responseProxy(): IResponse {
    const bunResponse = new BunResponse();
    return new Proxy(bunResponse, {
      get(target, prop, receiver) {
        if (
          typeof target[prop] === 'function' &&
          (prop === 'json' || prop === 'send') &&
          target.isReady()
        ) {
          throw new Error('You cannot send response twice');
        } else {
          return Reflect.get(target, prop, receiver);
        }
      },
    });
  }

  close() {
    this.bunServer?.stop();
  }

}
