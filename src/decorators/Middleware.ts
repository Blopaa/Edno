import { MiddlewareFunc } from "../types";
import middlewareStore from "../stores/MiddlewareStore";

export function ControllerMiddleware(
    middlewares: MiddlewareFunc[]
): ClassDecorator {
    return ((middleware: new () => unknown) => {
        middlewareStore.registerControllerMiddleware(middlewares, middleware);
    }) as ClassDecorator;
}

export function Middleware(middlewares: MiddlewareFunc[]): MethodDecorator {
    return ((target: any, propertyKey: string | symbol) => {
        middlewareStore.registerEndpointMiddleware(
            middlewares,
            propertyKey.toString(),
            target.constructor.name
        );
    }) as MethodDecorator;
}
