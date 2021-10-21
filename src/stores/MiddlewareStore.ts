import { MiddlewareFunc } from '../types/route';

class MiddlewareStore {
    private readonly _middlewares = new Map<String, MiddlewareFunc[]>();

    public registerControllerMiddleware(
        middlewares: MiddlewareFunc[],
        Middleware: new (...args: unknown[]) => unknown
    ) {
        this._middlewares.set(Middleware.name, middlewares);
    }

    public registerEndpointMiddleware(
        middlewares: MiddlewareFunc[],
        propertyKey: string,
        controller: string
    ) {
        this._middlewares.set(`${controller}-${propertyKey}`, middlewares)
    }

    public getMiddlewares(name: string): MiddlewareFunc[] | undefined {
        return this._middlewares.get(name);
    }
}

const middlewareStore = new MiddlewareStore();
export default middlewareStore;
