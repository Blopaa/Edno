import {
    ConfiguredRoute,
    EndpointFunc,
    MiddlewareFunc,
    Options,
} from "../types/route";
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
            this.options.middlewares.forEach((middleware) => {
                this.use(middleware);
            });
        }
        const loaders = new Loaders(this.options);
        await loaders.loadControllers();
        await loaders.loadErrorHandler();
        // prettier-ignore
        const configuredRoutes: ConfiguredRoute[] = new ConfigRoutes().configRoutes();
        configuredRoutes.map((e) => {
            this.methodFunction(e.method, e.path, ...e.functions);
        });
    }

    private methodFunction(
        method: string,
        path: string,
        ...rest: Array<EndpointFunc | MiddlewareFunc>
    ) {
        if (rest.length === 1) {
            this.router.registerRoutes(path, rest[0] as EndpointFunc, method);
        } else {
            const service = rest.pop() as EndpointFunc;
            this.router.registerRoutes(path, service, method, rest);
        }
    }

    private use(cb: MiddlewareFunc): void {
        this.router.beforeMiddleware.push(cb);
    }

    public start(cb?: () => void): void {
        cb ? cb() : undefined;
        this.router.create(this.options.port);
    }
}
