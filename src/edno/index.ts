import {
    ConfiguredRoute,
    RouteFunction,
    HeaderDef,
    Methods,
    Options,
} from "../types";
import { ConfigRoutes } from "../configRoutes/ConfigRoutes";
import { Loaders } from "../loaders";
import { Router } from "../router";
import { HttpStatusCode } from "../types/HttpStatus";

export class Edno {
    private readonly router = new Router();

    constructor(private options: Options) {
        (async () => {
            await this.initialise();
        })();
    }

    /**
     * load the routers and configure the routes, and then pass them to the router with all the necessary information.
     * @private
     */
    private async initialise() {
        if (this.options.middlewares) {
            this.options.middlewares.forEach((middleware: RouteFunction) => {
                this.router.beforeMiddleware.push(middleware);
            });
        }
        const loaders = new Loaders(this.options);
        await loaders.loadComponents();
        await loaders.loadControllers();
        await loaders.loadErrorHandler();
        // prettier-ignore
        const configuredRoutes: ConfiguredRoute[] = new ConfigRoutes().configRoutes();
        configuredRoutes.map((e: ConfiguredRoute) => {
            this.methodFunction(
                e.method,
                e.path,
                e.headers,
                e.status,
                e.key,
                ...e.functions
            );
        });
    }

    /**
     * sends route data to the router to set up routes
     * @param {Methods} method - the HTTP verb of the path
     * @param {string} path - the route path
     * @param {Array<HeaderDef>} headers - the route headers
     * @param {HttpStatusCode} status - the route status
     * @param {string} key - the route key to find it on stores
     * @param {Array<RouteFunction>} rest - route functions, middlewares and endpoints
     * @private
     */
    private methodFunction(
        method: Methods,
        path: string,
        headers: HeaderDef[],
        status: HttpStatusCode,
        key: string,
        ...rest: Array<RouteFunction>
    ) {
        const endpoint = rest.pop() as RouteFunction;
        this.router.registerRoutes(
            path,
            {
                status,
                cb: endpoint,
                headers,
                middleware: rest as RouteFunction[],
                key,
            },
            method
        );
    }

    public start(cb?: () => void): void {
        if (cb) {
            cb();
        }
        this.router.create(this.options.port);
    }
}
