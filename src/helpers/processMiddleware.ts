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

    let parameters = parameterStore.getParameters(
        `Function-${middleware.name}`
    ) as ParamDef[];

    if (parameters) {
        parameters = parameters
            .sort((a, b) => a.index - b.index)
            .map((parameter) => parameterReducer(req, res, parameter));
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
    } else {
        return new Promise((resolve) => {
            middleware(req, res, () => {
                resolve(true);
            });
        });
    }
}
