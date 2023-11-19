import { HttpStatusCode } from './enums/http-status-code.enum';
import { IError } from './interfaces/error.interface';
import { IRequest } from './interfaces/request.interface';
import { IResponse } from './interfaces/response.interface';
import { Middleware } from './types/handler.type';

export class Chain {

  private middlewares: Middleware[];

  constructor() {
    this.middlewares = [];
  }

  add(fn: Middleware[]) {
    this.middlewares = this.middlewares.concat(fn)
    return this;
  }

  async executeChain(req: IRequest, res: IResponse) {
    const index = 0;

    const runMiddleware = async (idx) => {
      if (idx < this.middlewares.length) {
        const nextCalled = { called: false };
        const middleware = this.middlewares[idx];

        const next = async (err?: IError) => {
          nextCalled.called = true;
          if (err) {
            this.sendError(res, err);
            return;
          }
          await runMiddleware(idx + 1);
        };
        const result = middleware(req, res, next);
        if (result instanceof Promise) {
          await result;
          if (!nextCalled.called) await next();
        } else if (!nextCalled.called) {
          throw new Error(`Middleware ${idx + 1} did not call next.`);
        }
      }
    };

    await runMiddleware(index);
  }

  private sendError(res: IResponse, err: IError) {
    let status = this.getErrorStatusCode(err);
    if (!status) {
      // fallback to status code on response
      status = this.getResponseStatusCode(res)
    }

    status = status || HttpStatusCode.INTERNAL_SERVER_ERROR

    const msg = err.message;
    res.status(status).json({
      message: msg,
      status: status
    });
  }

  private getErrorStatusCode(err: IError) {
    // check err.status
    if (typeof err.status === 'number' && err.status >= 400 && err.status < 600) {
      return err.status
    }
    return undefined
  }

  private getResponseStatusCode(res) {
    let status = res.statusCode

    // default status code to 500 if outside valid range
    if (typeof status !== 'number' || status < 400 || status > 599) {
      status = HttpStatusCode.INTERNAL_SERVER_ERROR;
    }

    return status
  }
}