import parameterStore from "../stores/ParameterStore";
import { ParamTypes } from "../types";

/**
 * sets a value of the request parameters
 * @param {string} details
 */
export function Param(details?: string): ParameterDecorator {
    return (
        target: object,
        propertyKey: string | symbol,
        parameterIndex: number
    ) => {
        parameterStore.registerParameter({
            name: details || "",
            value: undefined,
            type: ParamTypes.PARAM,
            index: parameterIndex,
            propertyKey: propertyKey.toString(),
            target: target.constructor.name,
        });
    };
}

/**
 * sets a value to the server response
 */
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

/**
 * sets a value of the request body
 * @param {string} details
 */
export function Body(details?: string): ParameterDecorator {
    return (
        target: object,
        propertyKey: string | symbol,
        parameterIndex: number
    ) => {
        parameterStore.registerParameter({
            name: details || "",
            value: undefined,
            type: ParamTypes.BODY,
            index: parameterIndex,
            propertyKey: propertyKey.toString(),
            target: target.constructor.name,
        });
    };
}

/**
 * sets a value of the middleware next function
 */
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

export function Headers(details?: string): ParameterDecorator {
    return (
        target: object,
        propertyKey: string | symbol,
        parameterIndex: number
    ) => {
        parameterStore.registerParameter({
            name: details || "",
            value: undefined,
            type: ParamTypes.HEADER,
            index: parameterIndex,
            propertyKey: propertyKey.toString(),
            target: target.constructor.name,
        });
    };
}
