import { EndpointManager } from './endpoint-manager'
import { RequestMethods } from './interfaces/request-method.inteface';
import { Handler, Middleware } from './types/handler.type'

export abstract class AbstractServer {

  protected requestMethods: RequestMethods = {};  

  get<T>(path: string, handler: Handler): T | Promise<T>;
  get(path: string, ...middlewares: Middleware[])
  get(path: string, ...handlers: Array<Middleware | Handler>) {
    this.requestHandler(this.get.name, path, handlers)
  }

  post<T>(path: string, handler: Handler): T | Promise<T>;
  post(path: string, ...middlewares: Middleware[])
  post(path: string, ...handlers: Array<Middleware | Handler>) {
    this.requestHandler(this.post.name, path, handlers)
  }

  put<T>(path: string, handler: Handler): T | Promise<T>;
  put(path: string, ...middlewares: Middleware[])
  put(path: string, ...handlers: Array<Middleware | Handler>) {
    this.requestHandler(this.put.name, path, handlers)
  }

  head<T>(path: string, handler: Handler): T | Promise<T>;
  head(path: string, ...middlewares: Middleware[])
  head(path: string, ...handlers: Array<Middleware | Handler>) {
    this.requestHandler(this.head.name, path, handlers)
  }

  delete<T>(path: string, handler: Handler): T | Promise<T>;
  delete(path: string, ...middlewares: Middleware[])
  delete(path: string, ...handlers: Array<Middleware | Handler>) {
    this.requestHandler(this.delete.name, path, handlers)
  }

  patch<T>(path: string, handler: Handler): T | Promise<T>;
  patch(path: string, ...middlewares: Middleware[])
  patch(path: string, ...handlers: Array<Middleware | Handler>) {
    this.requestHandler(this.patch.name, path, handlers)
  }

  options<T>(path: string, handler: Handler): T | Promise<T>;
  options(path: string, ...middlewares: Middleware[])
  options(path: string, ...handlers: Array<Middleware | Handler>) {
    this.requestHandler(this.options.name, path, handlers)
  }

  all<T>(path: string, handler: Handler): T | Promise<T>;
  all(path: string, ...middlewares: Middleware[])
  all(path: string, ...handlers: Array<Middleware | Handler>) {
    this.requestHandler(this.all.name, path, handlers)
  }

  private requestHandler(verb: string, path: string, handlers: Array<Middleware | Handler>) {
    const handler = handlers.pop() as Handler;
    this.addMethod(verb, path, handler, handlers);
  }

  private addMethod(method: string, path: string, handler: Handler, middlewares: Middleware[]) {
    const methodUpper = method.toUpperCase();
    let endpointManager: EndpointManager = this.requestMethods[methodUpper];
    if (!endpointManager) {
      this.requestMethods[methodUpper] = new EndpointManager();
      endpointManager = this.requestMethods[methodUpper];
    }
    this.addEndpoint(methodUpper, path, handler, middlewares);
    return endpointManager;
  }

  protected abstract addEndpoint(method: string, path: string, handler: Handler, middlewares: Middleware[]);
}
