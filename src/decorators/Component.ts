import injectorStore from "../stores/InjectorStore";

/**
 * record on InjectorStore components to be injected
 */
export function Component(): ClassDecorator {
    return ((component: new () => unknown) => {
        injectorStore.registerInjectable({
            controller: component.name,
            target: component,
        });
    }) as ClassDecorator;
}
