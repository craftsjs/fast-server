import { IFastServer, IRequest, IResponse } from '@craftsjs/fast-server';
import { INestApplication, HttpServer } from '@nestjs/common';

export interface NestFastServerApplication<
  TServer extends IFastServer,
> extends INestApplication<TServer> {
  /**
   * Returns the underlying HTTP adapter bounded to the Express.js app.
   *
   * @returns {HttpServer}
   */
  getHttpAdapter(): HttpServer<IRequest, IResponse, IFastServer>;

  /**
   * Starts the application.
   */
  listen(port: number | string, callback?: () => void): Promise<TServer>;
  listen(
    port: number | string,
    hostname?: string,
    callback?: () => void,
  ): Promise<TServer>;

}
