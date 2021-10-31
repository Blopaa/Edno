import * as http from "http";
import { MiddlewareFunc, Options, Request, Response } from "../types/route";
import { IncomingMessage, ServerResponse } from "http";
import readBody from "../helpers/readBody";
import { parse } from "../regex/url-to-regex";
import ResponseBuilder from "../response/responseBuilder";
import processMiddleware from "../helpers/processMiddleware";
import { existsSync } from "fs";
import { readDirRecursive } from "../helpers/readDirRecursive";
import controllerStore from "../stores/controllerStore";
import middlewareStore from "../stores/MiddlewareStore";
import { HttpException } from "../utils/HttpException";
import errorHandlerStore from "../stores/ErrorHandlerStore";

export class Edno {
    private routeTable: { [key: string]: any } = {};
    private beforeMiddleware: Array<MiddlewareFunc> = [];

    constructor(private options: Options) {
        if (options.middlewares) {
            options.middlewares.forEach((middleware) => {
                this.use(middleware);
            });
        }
        (async () => {
            await this.loadControllers();
            await this.loadErrorHandler();
            this.configRoutes();
        })();
    }

    private path(path: string): string {
        return this.options.root ? this.options.root.concat("/", path) : path;
    }

    private async loadErrorHandler() {
        const exceptionHandlerPath = this.options.exceptionPath;
        if (!exceptionHandlerPath) return;
        if (!existsSync(exceptionHandlerPath)) return;
        const files = readDirRecursive(exceptionHandlerPath);
        await Edno.dynamicImport(files);
        console.info(`loaded ${files.length} errorHandlers`);
    }

    private static async dynamicImport(files: string[]): Promise<void> {
        for (let x = 0; x < files.length; x++) {
            await import(files[x]);
        }
    }

    private async loadControllers(): Promise<void> {
        const controllersPath: string = this.path("controllers");
        if (!existsSync(controllersPath)) return;
        const files = readDirRecursive(controllersPath);
        await Edno.dynamicImport(files);
        console.info(`loaded ${files.length} controllers`);
    }

    private methodFunction(method: string, path: string, ...rest: any[]) {
        if (rest.length === 1) {
            this.registerRoutes(path, rest[0], method);
        } else {
            const service = rest.pop();
            this.registerRoutes(path, service, method, rest);
        }
    }

    private registerRoutes(
        path: string,
        cb: (req: Request, res: Response) => void,
        method: string,
        middleware?: Array<MiddlewareFunc>
    ) {
        if (!this.routeTable[path]) {
            this.routeTable[path] = {};
        }
        return (this.routeTable[path] = {
            ...this.routeTable[path],
            [method]: cb,
            [method + "-middleware"]: middleware,
        });
    }

    private use(cb: MiddlewareFunc): void {
        this.beforeMiddleware.push(cb);
    }

    public configRoutes(): void {
        const controllers: string[] = [];
        for (const endpoint of controllerStore) {
            const controllerMiddlewares =
                middlewareStore.getMiddlewares(endpoint.controller) || [];
            const endpointMiddlewares =
                middlewareStore.getMiddlewares(
                    `${endpoint.controller}-${endpoint.propertyKey}`
                ) || [];
            const controller = controllerStore.getController(
                endpoint.controller
            );
            if (!controller)
                throw new Error(`Controller ${endpoint.controller} not found`);
            if (!controllers.includes(endpoint.controller)) {
                controllers.push(endpoint.controller);
            }
            let path = `${controller.path}${
                controller.path.endsWith("/") && endpoint.path.startsWith("/")
                    ? endpoint.path.slice(1)
                    : !endpoint.path.startsWith("/") &&
                      !controller.path.endsWith("/")
                        ? "/".concat(endpoint.path)
                        : endpoint.path
            }`;
            const lastPath = path[path.length - 1];
            if (lastPath === "/") path = path.substring(1);
            this.methodFunction(
                endpoint.method.toLowerCase(),
                path,
                ...controllerMiddlewares.concat(
                    endpointMiddlewares,
                    (controller.target as Record<string, () => unknown>)[
                        endpoint.propertyKey
                    ].bind(controller.target)
                )
            );
        }
    }

    private create(port: number) {
        http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
            for (let y = 0; y < this.beforeMiddleware.length; y++) {
                this.beforeMiddleware[y](
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
            const routes = Object.keys(this.routeTable);
            let match = false;
            for (let i = 0; i < routes.length; i++) {
                const route = routes[i];
                const parsedRoute = parse(route);
                if (
                    new RegExp(parsedRoute).test(<string>overrideReq.url) &&
                    this.routeTable[route][
                        <string>overrideReq.method?.toLowerCase()
                    ]
                ) {
                    const cb =
                        this.routeTable[route][
                            <string>overrideReq.method?.toLowerCase()
                        ];
                    const middlewares: MiddlewareFunc[] =
                        this.routeTable[route][
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

    public start(cb?: () => void): void {
        cb ? cb() : undefined;
        this.create(this.options.port);
    }
}
