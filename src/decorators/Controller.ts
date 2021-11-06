import controllerStore from "../stores/controllerStore"

export default function Controller(path: string): ClassDecorator {
    return ((controller: new () => unknown) => {
        controllerStore.registerRoutes(path, controller);
    }) as ClassDecorator;
}
