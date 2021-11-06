import controllerStore from "../stores/controllerStore";
import { Methods } from "../types";

export function Get(path: string): MethodDecorator {
    return (target: any, propertyKey: string | symbol): void => {
        controllerStore.registerEndpoint({
            path,
            propertyKey: propertyKey.toString(),
            method: Methods.Get,
            controller: target.constructor.name,
        });
    };
}
export function Post(path: string): MethodDecorator {
    return (target: any, propertyKey: string | symbol): void => {
        controllerStore.registerEndpoint({
            path,
            propertyKey: propertyKey.toString(),
            method: Methods.Post,
            controller: target.constructor.name,
        });
    };
}
export function Put(path: string): MethodDecorator {
    return (target: any, propertyKey: string | symbol): void => {
        controllerStore.registerEndpoint({
            path,
            propertyKey: propertyKey.toString(),
            method: Methods.Put,
            controller: target.constructor.name,
        });
    };
}
export function Delete(path: string): MethodDecorator {
    return (target: any, propertyKey: string | symbol): void => {
        controllerStore.registerEndpoint({
            path,
            propertyKey: propertyKey.toString(),
            method: Methods.Delete,
            controller: target.constructor.name,
        });
    };
}
