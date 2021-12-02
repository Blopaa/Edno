import { Methods } from "../types";
import controllerStore from "../stores/controllerStore";

/**
 * sets an endpoint with GET as HTTP verb
 * @param {string} path
 */
export function Get(path: string): MethodDecorator {
    return (
        target: any,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ): void => {
        controllerStore.registerEndpoint({
            path,
            propertyKey: propertyKey.toString(),
            method: Methods.Get,
            controller: target.constructor.name,
            descriptor: descriptor.value,
        });
    };
}
/**
 * sets an endpoint with POST as HTTP verb
 * @param {string} path
 */

export function Post(path: string): MethodDecorator {
    return (
        target: any,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ): void => {
        controllerStore.registerEndpoint({
            path,
            propertyKey: propertyKey.toString(),
            method: Methods.Post,
            controller: target.constructor.name,
            descriptor: descriptor.value,
        });
    };
}

/**
 * sets an endpoint with PUT as HTTP verb
 * @param {string} path
 */
export function Put(path: string): MethodDecorator {
    return (
        target: any,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ): void => {
        controllerStore.registerEndpoint({
            path,
            propertyKey: propertyKey.toString(),
            method: Methods.Put,
            controller: target.constructor.name,
            descriptor: descriptor.value,
        });
    };
}

/**
 * sets an endpoint with DELETE as HTTP verb
 * @param {string} path
 */
export function Delete(path: string): MethodDecorator {
    return (
        target: any,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ): void => {
        controllerStore.registerEndpoint({
            path,
            propertyKey: propertyKey.toString(),
            method: Methods.Delete,
            controller: target.constructor.name,
            descriptor: descriptor.value,
        });
    };
}
