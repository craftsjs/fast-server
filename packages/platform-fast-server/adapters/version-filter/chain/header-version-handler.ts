import { VERSION_NEUTRAL, VersioningType } from '@nestjs/common';
import { AbstractHandler } from '../abstract-handler';
import { VersionedRoute } from '../versioned-route.type';
import { isString, isUndefined } from '../../utils/shared.utils';
import { callNextHandler } from '../next-handler';

export class HeaderVersioningHandler extends AbstractHandler {
  handle(req, res, next, version, versioningOptions, originalHandler): VersionedRoute {
    if (versioningOptions.type === VersioningType.HEADER) {
      const handlerForHeaderVersioning: VersionedRoute = (req, res, next) => {
        const customHeaderVersionParameter: string | undefined =
          req.headers?.[versioningOptions.header] ||
          req.headers?.[versioningOptions.header.toLowerCase()];

        // No version was supplied
        if (isUndefined(customHeaderVersionParameter)) {
          if (Array.isArray(version)) {
            if (version.includes(VERSION_NEUTRAL)) {
              return originalHandler(req, res, next);
            }
          }
        } else {
          if (Array.isArray(version)) {
            if (version.includes(customHeaderVersionParameter)) {
              return originalHandler(req, res, next);
            }
          } else if (isString(version)) {
            if (version === customHeaderVersionParameter) {
              return originalHandler(req, res, next);
            }
          }
        }

        return callNextHandler(req, res, next);
      };

      return handlerForHeaderVersioning;
    } else {
      return super.handle(req, res, next, version, versioningOptions, originalHandler);
    }
  }
}