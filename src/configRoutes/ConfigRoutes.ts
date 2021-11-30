import controllerStore from "../stores/controllerStore";
import middlewareStore from "../stores/MiddlewareStore";
import { ConfiguredRoute } from "../types";
import { HttpStatus } from "../types/HttpStatus";

export class ConfigRoutes {
    /**
     * will mix controller + endpoint to adapt routes to router handler
     * @return {Array<ConfiguredRoute>>} adapted routes.
     */
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
            const key = `${endpoint.controller}-${endpoint.propertyKey}`;
            const endpointHeaders = controllerStore.getHeaders(key);
            const endpointStatus = controllerStore.getStatus(key);
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
                method: endpoint.method,
                path,
                functions: controllerMiddlewares.concat(
                    endpointMiddlewares,
                    endpoint.descriptor
                ),
                headers: endpointHeaders,
                status: endpointStatus?.status || HttpStatus.OK,
                key,
            });
        }

        return routes;
    }
}
