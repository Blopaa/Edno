import { ControllerDef, EndpointDef, HeaderDef, unknownClass } from "../types";
import injectorStore from "./InjectorStore";

class ControllerStore implements Iterable<EndpointDef> {
    private readonly _list = new Map<string, ControllerDef>();
    private readonly endpoints = new Map<string, EndpointDef>();
    private readonly headers = new Map<string, HeaderDef>();

    /**
     * Stores endpoints.
     * @param {EndpointDef} endpoint - endpoint to store
     */
    public registerEndpoint(endpoint: EndpointDef) {
        const key = `${endpoint.controller}-${endpoint.propertyKey}`;
        this.endpoints.set(key, endpoint);
    }

    /**
     * Allows to do a for of the class and returns the endpoints.
     */
    public *[Symbol.iterator](): Iterator<EndpointDef> {
        for (const endpoint of this.endpoints.values()) {
            yield endpoint;
        }
    }

    /**
     * Stores headers.
     * @param {HeaderDef} header - header to store
     */
    public registerHeader(header: HeaderDef): void {
        const key = `${header.target}-${header.propertyKey}`;
        this.headers.set(key, header);
    }

    /**
     * Returns an array of headers depending on the endpoint and its controller.
     * @param {string} key - the key to find the headers
     *
     * @return {HeaderDef[] | undefined} The headers of an endpoint.
     */
    public getHeaders(key: string): HeaderDef[] {
        const headers = new Array<HeaderDef>();
        for(const header of this.headers.entries()){
            if(header[0] === key){
                headers.push(header[1]);
            }
        }

        return headers;
    }

    /**
     * Stores controllers
     * @param {string} path - the path handled by the controller
     * @param {unknownClass} Controller - the classroom decorated by the decorator
     */
    public registerRoutes(
        path: string,
        Controller: unknownClass
    ) {
        const injectors = injectorStore.getInjector(Controller.name);
        const sortedInjectors = injectors
            .sort((a, b) => a.index - b.index)
            .map((i) => injectorStore.getInjectable(i.toInject));
        const target = new Controller(...sortedInjectors);
        this._list.set(Controller.name, { path, target });
    }

    /**
     * Returns the controller by name.
     * @param {string} controller - the name of the controller
     *
     * @returns {ControllerDef | undefined} A controller.
     */
    public getController(controller: string): ControllerDef | undefined {
        return this._list.get(controller);
    }
}

const controllerStore = new ControllerStore();
export default controllerStore;
