import errorHandlerStore from "../stores/ErrorHandlerStore";
import { HttpException } from "../utils/HttpException";

/**
 * record new errorHandler for given exception.
 *
 * @param exceptionClass
 */
export function ErrorHandler(
    exceptionClass: new (...args: any[]) => HttpException
): MethodDecorator {
    return ((
        target: any,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ) => {
        errorHandlerStore.registerErrorHandler({
            target,
            propertyKey: propertyKey.toString(),
            handler: descriptor.value,
            exceptionHandled: exceptionClass.name,
        });
    }) as MethodDecorator;
}
