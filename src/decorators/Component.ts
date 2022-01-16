import injectorStore from "../stores/InjectorStore";
import { unknownClass } from "../types";

/**
 * record on InjectorStore components to be injected
 */
export function Component(): ClassDecorator {
    return ((component: unknownClass) => {
        injectorStore.registerInjectable({
            controller: component.name,
            target: component,
        });
    }) as ClassDecorator;
}
