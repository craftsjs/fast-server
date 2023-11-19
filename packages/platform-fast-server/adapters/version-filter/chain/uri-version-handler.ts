import { VERSION_NEUTRAL, VersioningType } from '@nestjs/common';
import { AbstractHandler } from '../abstract-handler';
import { VersionedRoute } from '../versioned-route.type';

export class UriVersioningHandler extends AbstractHandler {
  handle(req, res, next, version, versioningOptions, originalHandler): VersionedRoute {
    if (version === VERSION_NEUTRAL || versioningOptions.type === VersioningType.URI) {
      return originalHandler(req, res, next);
    } else {
      return super.handle(req, res, next, version, versioningOptions, originalHandler);
    }
  }
}
