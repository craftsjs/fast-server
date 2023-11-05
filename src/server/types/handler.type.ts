import { IError } from '../interfaces/error.interface';
import { IRequest } from '../interfaces/request.interface';
import { IResponse } from '../interfaces/response.interface';

export type Handler = (
  req: IRequest,
  res: IResponse
) => void | Promise<void>;

export type ErrorHandler = (
  req: IRequest | null,
  res: IResponse,
  err?: Error,
  next?: (err?: IError) => void | Promise<void>,
) => void | Promise<void>;

export type Middleware = (
  req: IRequest,
  res: IResponse,
  next: (err?: IError) => void | Promise<void>
 ) => void | Promise<void>;