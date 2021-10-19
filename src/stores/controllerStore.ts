import { ControllerDef, EndpointDef } from "../types/route";

class ControllerStore {
    private readonly _list = new Map<string, ControllerDef>();
    private readonly endpoints = new Map<string, EndpointDef>();

    public registerEndpoint(endpoint: EndpointDef){
        const key = `${endpoint.controller}-${endpoint.propertyKey}`
        this.endpoints.set(key, endpoint)
    }

    public registerRoutes(
        path: string,
        Controller: new (...args: unknown[]) => unknown
    ) {
        const target = new Controller([]);
        this._list.set(Controller.name, {path, target})
    }
}

const controllerStore = new ControllerStore();
export default controllerStore;
