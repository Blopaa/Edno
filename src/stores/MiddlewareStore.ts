import { MiddlewareFunc } from "../types";

class MiddlewareStore {
    private readonly linkedMiddlewares = new Map<string, MiddlewareFunc[]>();

    public registerControllerMiddleware(
        middlewares: MiddlewareFunc[],
        Middleware: new (...args: unknown[]) => unknown
    ) {
        this.linkedMiddlewares.set(Middleware.name, middlewares);
    }

    public registerEndpointMiddleware(
        middlewares: MiddlewareFunc[],
        propertyKey: string,
        controller: string
    ) {
        this.linkedMiddlewares.set(`${controller}-${propertyKey}`, middlewares);
    }

    public getLinkedMiddlewares(name: string): MiddlewareFunc[] | undefined {
        return this.linkedMiddlewares.get(name);
    }
}

const middlewareStore = new MiddlewareStore();
export default middlewareStore;
