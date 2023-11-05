import { Handler, Middleware } from "./types/handler.type";

type EndpointDefinition = {
  regex: RegExp;
  paramNames: string[];
  handler: Handler | Middleware;
  path: string;
  middlewares?: Middleware[]
};

export type EndpointMatch = {
  handler: Handler | Middleware;
  params: Record<string, string>;
  path: string,
  middlewares?: Middleware[]
};

export class EndpointManager {
  private endpoints: EndpointDefinition[] = [];

  addEndpoint(path: string, middleware: Middleware)
  addEndpoint(path: string, handler: Handler, middlewares?: Middleware[])
  addEndpoint(path: string, handler: Handler | Middleware, middlewares?: Middleware[]): void {
    const pattern = path
      .replace(/\/$/, '')
      .replace(/\//g, '\\/')
      .replace(/:\w+/g, '([^\\/]+)')
      .replace(/\*\w+/g, '(.+)')
      .replace(/\-\:\w+/g, '\\-([^\\/]+)');
    const regex = new RegExp(`^${pattern}$`);
    const paramNames = (path.match(/:\w+/g) || []).map(name => name.slice(1));

    this.endpoints.push({
      regex,
      paramNames,
      handler,
      path,
      middlewares
    });
  }

  matchEndpoint(path: string): EndpointMatch | undefined {
    for (let endpoint of this.endpoints) {
      const match = path.match(endpoint.regex);
      if (match) {
        let params: Record<string, string> = {};
        endpoint.paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });
        return {
          handler: endpoint.handler,
          params: params,
          middlewares: endpoint.middlewares,
          path: endpoint.path
        };
      }
    }
    return undefined;
  }
}
