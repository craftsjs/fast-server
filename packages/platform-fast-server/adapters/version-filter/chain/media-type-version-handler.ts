import { VERSION_NEUTRAL, VersioningType } from '@nestjs/common';
import { AbstractHandler } from '../abstract-handler';
import { VersionedRoute } from '../versioned-route.type';
import { isString, isUndefined } from '../../utils/shared.utils';
import { callNextHandler } from '../next-handler';

export class MediaTypeVersioningHandler extends AbstractHandler {
  handle(req, res, next, version, versioningOptions, originalHandler): VersionedRoute {
    // Media Type (Accept Header) Versioning Handler
    if (versioningOptions.type === VersioningType.MEDIA_TYPE) {
      const handlerForMediaTypeVersioning: VersionedRoute = (
        req,
        res,
        next,
      ) => {
        const MEDIA_TYPE_HEADER = 'Accept';
        const acceptHeaderValue: string | undefined =
          req.headers?.[MEDIA_TYPE_HEADER] ||
          req.headers?.[MEDIA_TYPE_HEADER.toLowerCase()];

        const acceptHeaderVersionParameter = acceptHeaderValue
          ? acceptHeaderValue.split(';')[1]
          : undefined;

        // No version was supplied
        if (isUndefined(acceptHeaderVersionParameter)) {
          if (Array.isArray(version)) {
            if (version.includes(VERSION_NEUTRAL)) {
              return originalHandler(req, res, next);
            }
          }
        } else {
          const headerVersion = acceptHeaderVersionParameter.split(
            versioningOptions.key,
          )[1];
          if (Array.isArray(version)) {
            if (version.includes(headerVersion)) {
              return originalHandler(req, res, next);
            }
          } else if (isString(version)) {
            if (version === headerVersion) {
              return originalHandler(req, res, next);
            }
          }
        }

        return callNextHandler(req, res, next);
      };

      return handlerForMediaTypeVersioning;
    } else {
      return super.handle(req, res, next, version, versioningOptions, originalHandler);
    }
  }
}