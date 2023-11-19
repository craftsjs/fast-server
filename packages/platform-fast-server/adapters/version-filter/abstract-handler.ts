import { Handler } from './handler.interface';
import { VersionedRoute } from './versioned-route.type';

export abstract class AbstractHandler implements Handler {
  
  private nextHandler: Handler | undefined;

  public setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }

  public handle(req, res, next, version, versioningOptions, originalHandler): VersionedRoute {
    if (this.nextHandler) {
      return this.nextHandler.handle(req, res, next, version, versioningOptions, originalHandler);
    }
    return originalHandler(req, res, next); // default action if no other handler in chain
  }
  
}
