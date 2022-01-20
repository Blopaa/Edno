import controllerStore from "../stores/controllerStore";
import { unknownClass } from "../types";

/**
 * record new controller with given path.
 *
 * @param path
 */
export default function Controller(path: string): ClassDecorator {
    return ((controller: unknownClass) => {
        controllerStore.registerRoutes(path, controller);
    }) as ClassDecorator;
}
