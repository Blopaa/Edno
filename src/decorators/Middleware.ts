import { MiddlewareFunc } from '../types/route';
import middlewareStore from '../stores/MiddlewareStore';

export function ControllerMiddleware(
    middlewares: MiddlewareFunc[]
): ClassDecorator {
    return ((middleware: new () => unknown) => {
        middlewareStore.registerControllerMiddleware(middlewares, middleware);
    }) as ClassDecorator;
}
