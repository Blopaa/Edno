import injectorStore from "../stores/InjectorStore";

/**
 * record where to inject with the given class
 *
 * @param injectable
 */
export function Inject(
    injectable: (new () => unknown) | (new (...args: any[]) => unknown)
): ParameterDecorator {
    return (
        target: any,
        propertyKey: string | symbol,
        parameterIndex: number
    ) => {
        injectorStore.registerInjector({
            toInject: injectable.name,
            target: target,
            index: parameterIndex,
        });
    };
}
