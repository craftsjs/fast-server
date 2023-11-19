import { InternalServerErrorException } from '@nestjs/common';
import { VersionedRoute } from './versioned-route.type';

export const callNextHandler: VersionedRoute = (_, __, next) => {
  if (!next) {
    throw new InternalServerErrorException(
      'HTTP adapter does not support filtering on version',
    );
  }
  return next();
};
