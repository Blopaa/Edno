import { ParamDef, ParamTypes, Request, Response } from "../types";

export function parameterReducer(
    req: Request,
    res: Response,
    parameter: ParamDef
): ParamDef {
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
        case ParamTypes.RESPONSE:
            parameter.value = res;
            break;
        case ParamTypes.NEXT:
            parameter.value = false;
            break;
    }
    return parameter;
}
