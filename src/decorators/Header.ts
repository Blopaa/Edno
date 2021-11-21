import controllerStore from "../stores/controllerStore";

export default function Header (headerName: string, headerValue: string): MethodDecorator {
    return ((target: Object, propertyKey: string | symbol) => {
        controllerStore.registerHeader({
            target: target.constructor.name,
            propertyKey: propertyKey.toString(),
            name: headerName,
            value: headerValue
        });
    }) as MethodDecorator;
}
