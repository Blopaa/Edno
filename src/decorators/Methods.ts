import { Methods } from "../types";
import controllerStore from "../stores/controllerStore";

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
