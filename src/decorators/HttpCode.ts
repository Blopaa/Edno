import controllerStore from "../stores/controllerStore";
import { HttpStatusCode } from "../types/HttpStatus";

/**
 * set endpoint status with given one
 * @param {number} status - status to return with the endpoint
 */
export default function HttpCode(status: HttpStatusCode): MethodDecorator {
    return ((target: object, propertyKey: string | symbol) => {
        controllerStore.registerStatus({
            status,
            target: target.constructor.name,
            propertyKey: propertyKey.toString(),
        });
    }) as MethodDecorator;
}
