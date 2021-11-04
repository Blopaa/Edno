import controllerStore from "../stores/controllerStore";
import middlewareStore from "../stores/MiddlewareStore";
import { ConfiguredRoute } from "../types/route";

export class ConfigRoutes {
    public configRoutes(): ConfiguredRoute[] {
        const controllers: string[] = [];
        const routes: ConfiguredRoute[] = [];
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
            routes.push({
                method: endpoint.method.toLowerCase(),
                path,
                functions: controllerMiddlewares.concat(
                    endpointMiddlewares,
                    (controller.target as Record<string, () => unknown>)[
                        endpoint.propertyKey
                    ].bind(controller.target)
                )
            });
        }

        return routes;
    }
}
