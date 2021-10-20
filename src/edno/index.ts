import * as http from 'http';
import { Middleware, Options, Request, Response } from '../types/route';
import { IncomingMessage, ServerResponse } from 'http';
import readBody from '../helpers/readBody';
import { parse } from '../regex/url-to-regex';
import ResponseBuilder from '../response/responseBuilder';
import processMiddleware from '../helpers/processMiddleware';
import { existsSync } from 'fs';
import { readDirRecursive } from '../helpers/readDirRecursive';
import controllerStore from '../stores/controllerStore';

export class Edno {
    private routeTable: { [key: string]: any } = {};
    private beforeMiddleware: Array<Middleware> = [];

    constructor(private options: Options) {
        (async () => {
            await this.loadControllers();
            this.configRoutes();
        })();
    }

    private path(path: string): string {
        return this.options.root ? this.options.root.concat('/', path) : path;
    }

    private async loadControllers(): Promise<void> {
        const controllersPath: string = this.path('controllers');
        if (!existsSync(controllersPath)) return;
        const files = readDirRecursive(controllersPath);
        for (let x = 0; x < files.length; x++) {
            await import(files[x]);
        }
        console.info(`loaded ${files.length} controllers`);
    }

    private methodFunction(method: string, path: string, ...rest: any[]) {
        if (rest.length === 1) {
            this.registerRoutes(path, rest[0], method);
        } else {
            let service = rest.pop();
            this.registerRoutes(path, service, method, rest);
        }
    }

    private registerRoutes(
        path: string,
        cb: (req: Request, res: Response) => void,
        method: string,
        middleware?: Array<Middleware>
    ) {
        if (!this.routeTable[path]) {
            this.routeTable[path] = {};
        }
        return (this.routeTable[path] = {
            ...this.routeTable[path],
            [method]: cb,
            [method + '-middleware']: middleware,
        });
    }

    public use(cb: Middleware): void {
        this.beforeMiddleware.push(cb);
    }

    public configRoutes() {
        const controllers: string[] = [];
        for (const endpoint of controllerStore) {
            const controller = controllerStore.getController(
                endpoint.controller
            );
            if (!controller)
                throw new Error(`Controller ${endpoint.controller} not found`);
            if (!controllers.includes(endpoint.controller)) {
                controllers.push(endpoint.controller);
            }
            let path = `${controller.path}${
                controller.path.endsWith('/') && endpoint.path.startsWith('/')
                    ? endpoint.path.slice(1)
                    : !endpoint.path.startsWith('/') &&
                      !controller.path.endsWith('/')
                    ? '/'.concat(endpoint.path)
                    : endpoint.path
            }`;
            let lastPath = path[path.length - 1];
            if (lastPath === '/') path = path.substring(1);
            this.createRoute(
                endpoint.method.toLowerCase(),
                path,
                (controller.target as Record<string, () => unknown>)[
                    endpoint.propertyKey
                ].bind(controller.target)
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
                            res.end('internal error on edno.use middleware');
                        }
                        return;
                    }
                );
            }
            const overrideReq: Request = <Request>req;
            const routes = Object.keys(this.routeTable);
            let match = false;
            for (let i = 0; i < routes.length; i++) {
                let route = routes[i];
                const parsedRoute = parse(route);
                if (
                    new RegExp(parsedRoute).test(<string>overrideReq.url) &&
                    this.routeTable[route][
                        <string>overrideReq.method?.toLowerCase()
                    ]
                ) {
                    let cb =
                        this.routeTable[route][
                            <string>overrideReq.method?.toLowerCase()
                        ];
                    let middlewares: Middleware[] =
                        this.routeTable[route][
                            `${req.method?.toLowerCase()}-middleware`
                        ];
                    const m = overrideReq.url?.match(new RegExp(parsedRoute));

                    overrideReq.params = m ? m.groups : undefined;
                    overrideReq.body = await readBody(req);
                    if(middlewares){
                        for (let mid = 0; mid < middlewares.length; mid++) {
                            await processMiddleware(
                              middlewares[mid],
                              overrideReq,
                              ResponseBuilder(<Response>res)
                            );
                        }
                    }
                    const overrideRes = ResponseBuilder(<Response>res);
                    cb(req, overrideRes);
                    match = true;
                    break;
                }
            }
            if (!match) {
                res.statusCode = 404;
                res.end('not found');
            }
        }).listen(port);
    }

    private createRoute(method: string, path: string, ...rest: any[]) {
        this.methodFunction(method, path, ...rest);
    }

    public start(cb?: () => void): void {
        cb ? cb() : undefined;
        this.create(this.options.port);
    }
}
