import processMiddleware from "../helpers/processMiddleware";
import errorHandlerStore from "../stores/ErrorHandlerStore";
import { HttpException } from "../utils/HttpException";
import { MethodDef, ParamDef, Request, Response } from "../types";
import parameterStore from "../stores/ParameterStore";
import { parameterReducer } from "./parameterReducer";

/**
 * handles parameter injection into middleware and endpoints
 * @param {Request} req - endpoint request
 * @param {Response} res - endpoint response
 * @param {MethodDef} currentEndpointData - the information needed to set up the endpoint
 */
export async function handleEndpoint(
    req: Request,
    res: Response,
    currentEndpointData: MethodDef
): Promise<void> {
    try {
        if (currentEndpointData.middleware) {
            // prettier-ignore
            for (let mid = 0; mid < currentEndpointData.middleware.length; mid++) {
                await processMiddleware(
                    currentEndpointData.middleware[mid],
                    req,
                    res
                );
            }
        }
        const parameters = parameterStore
            .getParameters(currentEndpointData.key)
            ?.sort((a, b) => a.index - b.index)
            .map((parameter) => parameterReducer(req, parameter)) as ParamDef[];
        res.json(
            (await currentEndpointData.cb(
                ...parameters.map((p) => p.value)
            )) as Record<string, any>
        );
    } catch (error: unknown) {
        const errorHandler = errorHandlerStore.getErrorHandler(
            (error as HttpException).constructor.name
        );
        if (!errorHandler) {
            res.json(error as HttpException);
            return;
        }
        const handler = errorHandler.handler(error as HttpException);
        res.status((error as HttpException).status).json(
            handler as Record<string, any>
        );
    }
}
