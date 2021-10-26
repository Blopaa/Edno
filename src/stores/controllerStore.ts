import { ControllerDef, EndpointDef } from "../types/route";

class ControllerStore implements Iterable<EndpointDef> {
    private readonly _list = new Map<string, ControllerDef>();
    private readonly endpoints = new Map<string, EndpointDef>();

    public registerEndpoint(endpoint: EndpointDef) {
        const key = `${endpoint.controller}-${endpoint.propertyKey}`;
        this.endpoints.set(key, endpoint);
    }

    public *[Symbol.iterator](): Iterator<EndpointDef> {
        for (const endpoint of this.endpoints.values()) {
            yield endpoint;
        }
    }

    public registerRoutes(
        path: string,
        Controller: new (...args: unknown[]) => unknown
    ) {
        const target = new Controller([]);
        this._list.set(Controller.name, { path, target });
    }

    public getController(controller: string): ControllerDef | undefined {
        return this._list.get(controller);
    }
}

const controllerStore = new ControllerStore();
export default controllerStore;
