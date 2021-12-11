import http, { IncomingMessage, ServerResponse } from "http";
import { MethodDef, Methods, RouteFunction, Request, Response } from "../types";
import { parse } from "../regex/urlToRegex";
import readBody from "../helpers/readBody";
import ResponseBuilder from "../response/responseBuilder";
import { handleEndpoint } from "../configRoutes/handleEndpoint";

export class Router {
    private readonly _routeTable: Record<string, Record<Methods, MethodDef>> =
        {};
    private readonly _beforeMiddleware: Array<RouteFunction> = [];

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
            let routeMatch: string = "";
            for (let i = 0; i < routes.length; i++) {
                const parsedRoute = parse(routes[i]);
                if (
                    new RegExp(parsedRoute).test(<string>overrideReq.url) &&
                    this._routeTable[routes[i]][<Methods>overrideReq.method] &&
                    overrideReq.url ===  routes[i]
                ) {
                    routeMatch = routes[i];
                    match = true
                } else if(!routeMatch && new RegExp(parsedRoute).test(<string>overrideReq.url) &&
                  this._routeTable[routes[i]][<Methods>overrideReq.method] ){
                    routeMatch = routes[i];
                    match = true
                }
            }


            const currentEndpointData: MethodDef =
              this._routeTable[routeMatch][<Methods>req.method];
            const matches = overrideReq.url?.match(
              new RegExp(parse(routeMatch))
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
            await handleEndpoint(
              overrideReq,
              overrideRes,
              currentEndpointData
            );


            if (!match) {
                res.statusCode = 404;
                res.end("not found");
            }
        }).listen(port);
    }

    get beforeMiddleware(): Array<RouteFunction> {
        return this._beforeMiddleware;
    }
}
