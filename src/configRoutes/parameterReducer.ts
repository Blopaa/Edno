import { ParamDef, ParamTypes, Request } from "../types";

/**
 * handles the different types of parameters and their values
 * @param {Request} req - endpoint request
 * @param {ParamDef} parameter - endpoint parameter data
 */
export function parameterReducer(req: Request, parameter: ParamDef): ParamDef {
    switch (parameter.type) {
        case ParamTypes.BODY:
            parameter.value = parameter.name
                ? req.body[parameter.name]
                : req.body;
            break;
        case ParamTypes.PARAM:
            parameter.value = parameter.name
                ? req.params[parameter.name]
                : req.params;
            break;
        case ParamTypes.NEXT:
            parameter.value = false;
            break;
        case ParamTypes.HEADER:
            parameter.value = parameter.name
                ? req.headers[parameter.name]
                : req.headers;
    }
    return parameter;
}
