import {
    ConfiguredRoute,
    EndpointFunc,
    HeaderDef,
    Methods,
    MiddlewareFunc,
    Options,
} from "../types";
import { ConfigRoutes } from "../configRoutes/ConfigRoutes";
import { Loaders } from "../loaders";
import { Router } from "../router";

export class Edno {
    private readonly router = new Router();

    constructor(private options: Options) {
        (async () => {
            await this.initialise();
        })();
    }

    private async initialise() {
        if (this.options.middlewares) {
            this.options.middlewares.forEach((middleware: MiddlewareFunc) => {
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

    private methodFunction(
        method: Methods,
        path: string,
        headers: HeaderDef[],
        status: number,
        key: string,
        ...rest: Array<EndpointFunc | MiddlewareFunc>
    ) {
        const endpoint = rest.pop() as EndpointFunc;
        this.router.registerRoutes(
            path,
            {
                status,
                cb: endpoint,
                headers,
                middleware: rest as MiddlewareFunc[],
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
