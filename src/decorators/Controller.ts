import controllerStore from "../stores/controllerStore";

/**
 * record new controller with given path.
 *
 * @param path
 */
export default function Controller(path: string): ClassDecorator {
    return ((controller: new () => unknown) => {
        controllerStore.registerRoutes(path, controller);
    }) as ClassDecorator;
}
