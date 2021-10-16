import * as http from 'http';
import { Request, Response } from '../types/route';
import { IncomingMessage, ServerResponse } from 'http';
import readBody from '../helpers/readBody';
import { parse } from '../regex/url-to-regex';
import createResponse from '../helpers/createResponse';
import processMiddleware from '../helpers/processMiddleware';

export class Edno {
    private routeTable: { [key: string]: any } = {};

    private registerRoutes(
        path: string,
        cb: (req: Request, res: Response) => void,
        method: string,
        middleware?: (req: Request, res: Response, next: any) => void
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

    public create() {
        http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
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
                    let middleware =
                        this.routeTable[route][
                            `${req.method?.toLowerCase()}-middleware`
                        ];

                    const m = overrideReq.url?.match(new RegExp(parsedRoute));

                    overrideReq.params = m ? m.groups : undefined;
                    overrideReq.body = await readBody(req);
                    await processMiddleware(
                        middleware,
                        overrideReq,
                        res
                    );
                    const overrideRes = createResponse(<Response>res)
                    cb(req, overrideRes);
                    match = true;
                    break;
                }
            }
            if (!match) {
                res.statusCode = 404;
                res.end('not found');
            }
        }).listen(3000);

        return {
            get: (path: string, ...rest: any[]) => {
                if (rest.length === 1) {
                    this.registerRoutes(path, rest[0], 'get');
                } else {
                    this.registerRoutes(path, rest[1], 'get', rest[0]);
                }
            },
        };
    }
}
