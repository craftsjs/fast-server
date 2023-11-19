import { VersioningType } from '@nestjs/common';
import { AbstractHandler } from '../abstract-handler';
import { VersionedRoute } from '../versioned-route.type';
import { isString } from '../../utils/shared.utils';
import { callNextHandler } from '../next-handler';

export class CustomVersioningHandler extends AbstractHandler {
  handle(req, res, next, version, versioningOptions, originalHandler): VersionedRoute {
    if (versioningOptions.type === VersioningType.CUSTOM) {
      const handlerForCustomVersioning: VersionedRoute = (req, res, next) => {
        const extractedVersion = versioningOptions.extractor(req);

        if (Array.isArray(version)) {
          if (
            Array.isArray(extractedVersion) &&
            version.filter(v => extractedVersion.includes(v as string)).length
          ) {
            return originalHandler(req, res, next);
          }

          if (
            isString(extractedVersion) &&
            version.includes(extractedVersion)
          ) {
            return originalHandler(req, res, next);
          }
        } else if (isString(version)) {
          // Known bug here - if there are multiple versions supported across separate
          // handlers/controllers, we can't select the highest matching handler.
          // Since this code is evaluated per-handler, then we can't see if the highest
          // specified version exists in a different handler.
          if (
            Array.isArray(extractedVersion) &&
            extractedVersion.includes(version)
          ) {
            return originalHandler(req, res, next);
          }

          if (isString(extractedVersion) && version === extractedVersion) {
            return originalHandler(req, res, next);
          }
        }

        return callNextHandler(req, res, next);
      };

      return handlerForCustomVersioning;
    } else {
      return super.handle(req, res, next, version, versioningOptions, originalHandler);
    }
  }
}