import {
    ControllerDef,
    EndpointDef,
    HeaderDef,
    StatusDef,
    unknownArgClass,
} from "../types";
import injectorStore from "./InjectorStore";

class ControllerStore implements Iterable<EndpointDef> {
    private readonly _list = new Map<string, ControllerDef>();
    private readonly endpoints = new Map<string, EndpointDef>();
    private readonly headers = new Map<string, HeaderDef>();
    private readonly status = new Map<string, StatusDef>();

    /**
     * Stores status.
     * @param {number} status - the status to be returned by the endpoint
     */
    public registerStatus(status: StatusDef) {
        const key = `${status.target}-${status.propertyKey}`;
        this.status.set(key, status);
    }

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
        for (const header of this.headers.entries()) {
            if (header[0] === key) {
                headers.push(header[1]);
            }
        }

        return headers;
    }

    /**
     * Stores controllers
     * @param {string} path - the path handled by the controller
     * @param {unknownArgClass} Controller - the class decorated by the decorator
     */
    public registerRoutes(path: string, Controller: unknownArgClass) {
        const injectors = injectorStore.getInjector(Controller.name);
        const sortedInjectors = injectors
            .sort((a, b) => a.index - b.index)
            .map((i) => injectorStore.getInjectable(i.toInject));
        const target = new Controller(...sortedInjectors);
        this._list.set(Controller.name, { path, target });
    }

    /**
     * returns a status for its key
     * @param {string} key - the key to find the ednpoint status
     */
    public getStatus(key: string): StatusDef | undefined {
        return this.status.get(key);
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
