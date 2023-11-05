import { AbstractServer } from "./abstract-server";
import { EndpointManager } from "./endpoint-manager";
import { RequestMethods } from "./interfaces/request-method.inteface";
import { IVerb } from "./interfaces/verb.interface";
import { Handler, Middleware } from "./types/handler.type";

type HandlerMethods = {
    method: string;
    path: string;
    handler: Handler;
    middlewares?: Middleware[];
}

export class Router extends AbstractServer implements IVerb {

    private handlerMethods: HandlerMethods[] = [];

    private localMiddlewares: Middleware[] = [];

    addEndpoint(method: string, path: string, handler: Handler, middlewares?: Middleware[]) {
        this.handlerMethods.push({
            handler,
            method,
            middlewares,
            path
        })
    }

    use(middleware: Middleware) {
        this.localMiddlewares.push(middleware);
    }

    attach(path: string, requestMethods: RequestMethods) {
        this.handlerMethods.forEach(hm => {
            let endpointManager = requestMethods[hm.method] as EndpointManager;
            if(endpointManager === undefined) {
                requestMethods[hm.method] = new EndpointManager();
                endpointManager = requestMethods[hm.method];
            }
            endpointManager.addEndpoint(path + hm.path, hm.handler, (hm.middlewares || []).concat(this.localMiddlewares));
        })
    }

}