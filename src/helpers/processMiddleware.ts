import { MiddlewareFunc, ParamDef, Request, Response } from "../types";
import parameterStore from "../stores/ParameterStore";
import { parameterReducer } from "../configRoutes/parameterReducer";

export default function processMiddleware(
    middleware: MiddlewareFunc,
    req: Request,
    res: Response
): Promise<unknown> {
    if (!middleware) {
        //handling
        return new Promise((resolve) => resolve(true));
    }

    const parameters = parameterStore
        .getParameters(`Function-${middleware.name}`)
        ?.sort((a, b) => a.index - b.index)
        .map((parameter) =>
            parameterReducer(req, res, parameter)
        ) as ParamDef[];

    return new Promise((resolve) => {
        middleware(
            ...parameters.map((p) =>
                p.value
                    ? p.value
                    : (p.value = () => {
                          resolve(true);
                      })
            )
        );
    });
}
