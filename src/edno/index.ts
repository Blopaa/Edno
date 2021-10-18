import * as http from 'http';
import { Middleware, Request, Response } from '../types/route';
import { IncomingMessage, ServerResponse } from 'http';
import readBody from '../helpers/readBody';
import { parse } from '../regex/url-to-regex';
import ResponseBuilder from '../response/responseBuilder';
import processMiddleware from '../helpers/processMiddleware';

export class Edno {
    private routeTable: { [key: string]: any } = {};
    private beforeMiddleware: Array<Middleware> = [];

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

    public create(port: number) {
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
                    for (let mid = 0; mid < middlewares.length; mid++) {
                        await processMiddleware(
                            middlewares[mid],
                            overrideReq,
                            ResponseBuilder(<Response>res)
                        );
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

        return {
            get: (path: string, ...rest: any[]) => {
                this.methodFunction('get', path, ...rest);
            },
            post: (path: string, ...rest: any[]) => {
                this.methodFunction('post', path, ...rest);
            },
            put: (path: string, ...rest: any[]) => {
                this.methodFunction('put', path, ...rest);
            },
            delete: (path: string, ...rest: any[]) => {
                this.methodFunction('delete', path, ...rest);
            },
        };
    }
}
