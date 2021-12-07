import { Injectable, Injector } from "../types";

class InjectorStore {
    private injectables = new Map<string, Injectable>();
    private injectors = new Array<Injector>();

    /**
     * stores injectables
     * @param  {Injectable} injectable - Injectable to store
     */
    public registerInjectable(injectable: Injectable) {
        const injectors = this.getInjector(injectable.controller);
        const sortedInjectors = injectors
            .sort((a, b) => a.index - b.index)
            .map((i) => injectorStore.getInjectable(i.toInject));
        this.injectables.set(
            `${injectable.controller}`,
            new injectable.target(...sortedInjectors) as Injectable
        );
    }

    /**
     * return an Injectable from given key
     * @param {string} injectable - Injectable key
     * @return {Injectable | undefined} - found Injectable or undefined
     */
    public getInjectable(injectable: string): Injectable | undefined {
        return this.injectables.get(injectable);
    }

    /**
     * stores Injectors
     * @param {Injector} injector - Injector to store
     */
    public registerInjector(injector: Injector) {
        this.injectors.push(injector);
    }

    /**
     * return an Injector from given key
     * @param {string} injector - injector key
     * @return {Array<Injector>} - found injectors
     */
    public getInjector(injector: string): Injector[] {
        return this.injectors.filter((e) => e.target.name === injector);
    }
}

const injectorStore = new InjectorStore();
export default injectorStore;
