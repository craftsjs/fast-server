import { VersionedRoute } from './versioned-route.type';

export interface Handler {
  setNext(handler: Handler): Handler;
  handle(req, res, next, version, versioningOptions, originalHandler): VersionedRoute;
}
