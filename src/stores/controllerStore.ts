import { ControllerDef, EndpointDef } from "../types";
import injectorStore from "./InjectorStore";

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
        const injectors = injectorStore.getInjector(Controller.name);
        const sortedInjectors = injectors
            .sort((a, b) => a.index - b.index)
            .map((i) => injectorStore.getInjectable(i.toInject));
        const target = new Controller(...sortedInjectors);
        this._list.set(Controller.name, { path, target });
    }

    public getController(controller: string): ControllerDef | undefined {
        return this._list.get(controller);
    }
}

const controllerStore = new ControllerStore();
export default controllerStore;
