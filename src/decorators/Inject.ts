import injectorStore from "../stores/InjectorStore";

export function Inject(injectable: new () => unknown): ParameterDecorator {
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
