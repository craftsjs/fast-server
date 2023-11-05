import { Handler, Middleware } from "../types/handler.type";

export interface IVerb {
    get<T>(path: string, handler: Handler): T | Promise<T>;
    get(path: string, ...middlewares: Middleware[]);
  
    post<T>(path: string, handler: Handler): T | Promise<T>;
    post(path: string, ...middlewares: Middleware[]);
  
    put<T>(path: string, handler: Handler): T | Promise<T>;
    put(path: string, ...middlewares: Middleware[]);
  
    head<T>(path: string, handler: Handler): T | Promise<T>;
    head(path: string, ...middlewares: Middleware[]);
    
    delete<T>(path: string, handler: Handler): T | Promise<T>;
    delete(path: string, ...middlewares: Middleware[]);
  
    patch<T>(path: string, handler: Handler): T | Promise<T>;
    patch(path: string, ...middlewares: Middleware[]);
  
    options<T>(path: string, handler: Handler): T | Promise<T>;
    options(path: string, ...middlewares: Middleware[]);

    all<T>(path: string, handler: Handler): T | Promise<T>;
    all(path: string, ...middlewares: Middleware[]);
}