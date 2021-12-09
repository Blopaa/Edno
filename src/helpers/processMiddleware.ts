import { RouteFunction, ParamDef, Request, Response } from "../types";
import parameterStore from "../stores/ParameterStore";
import { parameterReducer } from "../configRoutes/parameterReducer";

/**
 * handles the middlewares of the routes, injecting the values of its parameters
 * @param {RouteFunction} middleware
 * @param {Request} req
 * @param {Response} res
 */
export default function processMiddleware(
    middleware: RouteFunction,
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
            .map((parameter) => parameterReducer(req, parameter));
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
