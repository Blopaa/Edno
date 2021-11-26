import http, { IncomingMessage, ServerResponse } from "http";
import {
    MethodDef,
    Methods,
    MiddlewareFunc,
    Request,
    Response,
} from "../types";
import { parse } from "../regex/urlToRegex";
import readBody from "../helpers/readBody";
import ResponseBuilder from "../response/responseBuilder";
import processMiddleware from "../helpers/processMiddleware";
import errorHandlerStore from "../stores/ErrorHandlerStore";
import { HttpException } from "../utils/HttpException";

export class Router {
    private readonly _routeTable: Record<string, Record<Methods, MethodDef>> =
        {};
    private readonly _beforeMiddleware: Array<MiddlewareFunc> = [];

    /**
     * records all routes along with all the information needed to handle them
     * @param {string} path - the endpoint path
     * @param {MethodDef} endpoint - current endpoint data
     * @param {Methods} method - the endpoint HTTP verb
     */
    public registerRoutes(
        path: string,
        endpoint: MethodDef,
        method: Methods
    ): void {
        if (!this._routeTable[path]) {
            this._routeTable[path] = {} as Record<Methods, MethodDef>;
        }
        this._routeTable[path][method] = endpoint;
    }

    /**
     * creates an http server and handles routes and errorHandlers
     * @param {number} port - where the application will be hosted.
     */
    public create(port: number): void {
        http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
            for (let y = 0; y < this._beforeMiddleware.length; y++) {
                this._beforeMiddleware[y](
                    <Request>req,
                    <Response>res,
                    (err: unknown) => {
                        if (err) {
                            res.statusCode = 500;
                            res.end("internal error on edno.use middleware");
                        }
                        return;
                    }
                );
            }
            const overrideReq: Request = <Request>req;
            const routes = Object.keys(this._routeTable);
            let match = false;
            for (let i = 0; i < routes.length; i++) {
                const parsedRoute = parse(routes[i]);
                if (
                    new RegExp(parsedRoute).test(<string>overrideReq.url) &&
                    this._routeTable[routes[i]][<Methods>overrideReq.method]
                ) {
                    const currentEndpointData: MethodDef =
                        this._routeTable[routes[i]][<Methods>req.method];
                    const matches = overrideReq.url?.match(
                        new RegExp(parsedRoute)
                    );

                    overrideReq.params = matches?.groups as Record<string, any>;
                    overrideReq.body = JSON.parse(
                        (await readBody(req)) || "[]"
                    );
                    const overrideRes = ResponseBuilder(
                        <Response>res,
                        currentEndpointData.status
                    );
                    if (currentEndpointData.headers) {
                        currentEndpointData.headers.forEach((header) => {
                            res.setHeader(header.name, header.value);
                        });
                    }
                    try {
                        if (currentEndpointData.middleware) {
                            for (
                                let mid = 0;
                                mid < currentEndpointData.middleware.length;
                                mid++
                            ) {
                                await processMiddleware(
                                    currentEndpointData.middleware[mid],
                                    overrideReq,
                                    overrideRes
                                );
                            }
                        }
                        await currentEndpointData.cb(overrideReq, overrideRes);
                    } catch (error: unknown) {
                        const errorHandler = errorHandlerStore.getErrorHandler(
                            (error as HttpException).constructor.name
                        );
                        if (!errorHandler) {
                            overrideRes.json(error as HttpException);
                            return;
                        }
                        const handler = errorHandler.handler(
                            error as HttpException
                        );
                        overrideRes
                            .status((error as HttpException).status)
                            .json(handler as Record<string, any>);
                    }
                    match = true;
                    break;
                }
            }
            if (!match) {
                res.statusCode = 404;
                res.end("not found");
            }
        }).listen(port);
    }

    get beforeMiddleware(): Array<MiddlewareFunc> {
        return this._beforeMiddleware;
    }
}
