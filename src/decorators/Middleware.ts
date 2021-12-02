import { RouteFunction } from "../types";
import middlewareStore from "../stores/MiddlewareStore";

/**
 * decorator to add middlewares to whole controller
 * @param middlewares
 */
export function ControllerMiddleware(
    middlewares: RouteFunction[]
): ClassDecorator {
    return ((middleware: new () => unknown) => {
        middlewareStore.registerControllerMiddleware(middlewares, middleware);
    }) as ClassDecorator;
}

/**
 * decorator to add middlewares just to an endpoint
 * @param middlewares
 */
export function Middleware(middlewares: RouteFunction[]): MethodDecorator {
    return ((target: any, propertyKey: string | symbol) => {
        middlewareStore.registerEndpointMiddleware(
            middlewares,
            propertyKey.toString(),
            target.constructor.name
        );
    }) as MethodDecorator;
}
