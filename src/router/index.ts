import http, { IncomingMessage, ServerResponse } from "http";
import {
    EndpointFunc,
    MiddlewareFunc,
    Request,
    Response,
} from "../types/route";
import { parse } from "../regex/url-to-regex";
import readBody from "../helpers/readBody";
import ResponseBuilder from "../response/responseBuilder";
import processMiddleware from "../helpers/processMiddleware";
import errorHandlerStore from "../stores/ErrorHandlerStore";
import { HttpException } from "../utils/HttpException";

export class Router {
    private readonly _routeTable: Record<string, any> = {};
    private readonly _beforeMiddleware: Array<MiddlewareFunc> = [];

    public registerRoutes(
        path: string,
        cb: EndpointFunc,
        method: string,
        middleware?: Array<MiddlewareFunc>
    ): void {
        if (!this._routeTable[path]) {
            this._routeTable[path] = {};
        }
        this._routeTable[path] = {
            ...this._routeTable[path],
            [method]: cb,
            [method + "-middleware"]: middleware,
        };
    }

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
                const route = routes[i];
                const parsedRoute = parse(route);
                if (
                    new RegExp(parsedRoute).test(<string>overrideReq.url) &&
                    this._routeTable[route][
                        <string>overrideReq.method?.toLowerCase()
                    ]
                ) {
                    const cb =
                        this._routeTable[route][
                            <string>overrideReq.method?.toLowerCase()
                        ];
                    const middlewares: MiddlewareFunc[] =
                        this._routeTable[route][
                            `${req.method?.toLowerCase()}-middleware`
                        ];
                    const m = overrideReq.url?.match(new RegExp(parsedRoute));

                    overrideReq.params = m ? m.groups : undefined;
                    overrideReq.body = await readBody(req);
                    const overrideRes = ResponseBuilder(<Response>res);
                    try {
                        if (middlewares) {
                            for (let mid = 0; mid < middlewares.length; mid++) {
                                await processMiddleware(
                                    middlewares[mid],
                                    overrideReq,
                                    ResponseBuilder(<Response>res)
                                );
                            }
                        }
                        cb(req, overrideRes);
                    } catch (error: unknown) {
                        const errorHandler = errorHandlerStore.getErrorHandler(
                            (error as HttpException).constructor.name
                        );
                        if (!errorHandler) {
                            overrideRes.json(error as HttpException);
                            return;
                        }
                        const handler = errorHandler.handler(
                            (error as HttpException).message
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