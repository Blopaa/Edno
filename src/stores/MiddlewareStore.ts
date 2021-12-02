import { RouteFunction, unknownArgClass } from "../types";

class MiddlewareStore {
    private readonly linkedMiddlewares = new Map<string, RouteFunction[]>();

    /**
     * stores controllerMiddlewares
     * @param {Array<RouteFunction>} middlewares - middleware functions
     * @param {unknownArgClass} Middleware - parent class where decorator is called
     */
    public registerControllerMiddleware(
        middlewares: RouteFunction[],
        Middleware: unknownArgClass
    ) {
        this.linkedMiddlewares.set(Middleware.name, middlewares);
    }

    /**
     * stores endpointMiddlewares
     * @param {Array<RouteFunction>} middlewares - middleware functions
     * @param {string} propertyKey - endpoint method name
     * @param {string} controller - endpoint class name
     */
    public registerEndpointMiddleware(
        middlewares: RouteFunction[],
        propertyKey: string,
        controller: string
    ) {
        this.linkedMiddlewares.set(`${controller}-${propertyKey}`, middlewares);
    }

    /**
     * returns middlewares from given id
     * @param {string} name - key to find middlewares
     * @returns {Array<RouteFunction> | undefined} - found middleware/s or undefined
     */
    public getLinkedMiddlewares(name: string): RouteFunction[] | undefined {
        return this.linkedMiddlewares.get(name);
    }
}

const middlewareStore = new MiddlewareStore();
export default middlewareStore;
