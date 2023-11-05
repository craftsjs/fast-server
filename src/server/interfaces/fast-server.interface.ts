import { Server } from 'bun';
import { FastServerOptions } from './server-options.interface';
import { ErrorHandler, Middleware } from '../types/handler.type';
import { IVerb } from './verb.interface';
import { IRouter } from './router.interface';

export interface IFastServer extends IVerb {

  listen(serverOptions?: FastServerOptions): Server;
  router(): IRouter;
  close(): void;
  
  use(middleware: Middleware): void;
  use(errorHandler: ErrorHandler): void;
  use(path: string, middleware: Middleware): void;
  use(path: string, router: IRouter): void;

}

