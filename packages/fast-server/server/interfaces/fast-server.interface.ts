import { Server } from 'bun';
import { FastServerOptions } from './server-options.interface';
import { ErrorHandler, Handler, Middleware } from '../types/handler.type';
import { IVerb } from './verb.interface';
import { IRouter } from './router.interface';
import { EventCallback } from '../utils/event-emiter.util';
import { ServeStaticOptions } from './static.interface';

export interface IFastServer extends IVerb {
  
  bunServer: Server | undefined;
  listen(serverOptions?: FastServerOptions): Server;
  setNotFoundHandler(handler: Handler)
  router(): IRouter;
  close(): void;
  address(): string | undefined;
  once(type: string, callback: EventCallback);
  removeListener(type: string, callback: EventCallback);
  static(path: string, options?: ServeStaticOptions): Promise<IRouter>;
  
  use(middleware: Middleware): void;
  use(errorHandler: ErrorHandler): void;
  use(path: string, middleware: Middleware): void;
  use(path: string, router: IRouter): void;

}

