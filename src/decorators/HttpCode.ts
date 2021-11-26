import controllerStore from "../stores/controllerStore";

export default function HttpCode(status: number): MethodDecorator {
    return ((target: object, propertyKey: string | symbol) => {
        controllerStore.registerStatus({
            status,
            target: target.constructor.name,
            propertyKey: propertyKey.toString(),
        });
    }) as MethodDecorator;
}
