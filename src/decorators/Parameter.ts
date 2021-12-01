import parameterStore from "../stores/ParameterStore";
import { ParamTypes } from "../types";

export function Param(details: string): ParameterDecorator {
    return (
        target: object,
        propertyKey: string | symbol,
        parameterIndex: number
    ) => {
        parameterStore.registerParameter({
            name: details,
            value: undefined,
            type: ParamTypes.PARAM,
            index: parameterIndex,
            propertyKey: propertyKey.toString(),
            target: target.constructor.name,
        });
    };
}

export function Res(): ParameterDecorator {
    return (
        target: object,
        propertyKey: string | symbol,
        parameterIndex: number
    ) => {
        parameterStore.registerParameter({
            name: "",
            value: undefined,
            type: ParamTypes.RESPONSE,
            index: parameterIndex,
            propertyKey: propertyKey.toString(),
            target: target.constructor.name,
        });
    };
}

export function Body(details: string): ParameterDecorator {
    return (
        target: object,
        propertyKey: string | symbol,
        parameterIndex: number
    ) => {
        parameterStore.registerParameter({
            name: details,
            value: undefined,
            type: ParamTypes.BODY,
            index: parameterIndex,
            propertyKey: propertyKey.toString(),
            target: target.constructor.name,
        });
    };
}

export function Next(): ParameterDecorator {
    return (
        target: object,
        propertyKey: string | symbol,
        parameterIndex: number
    ) => {
        parameterStore.registerParameter({
            name: "",
            value: undefined,
            type: ParamTypes.NEXT,
            index: parameterIndex,
            propertyKey: propertyKey.toString(),
            target: target.constructor.name,
        });
    };
}
