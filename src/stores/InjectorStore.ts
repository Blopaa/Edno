import { Injectable, Injector } from "../types";

class InjectorStore {
  private injectables = new Map<string, Injectable>();
  private injectors = new Array<Injector>();

  public registerInjectable (injectable: Injectable){
      this.injectables.set(`${injectable.controller}`, new injectable.target() as Injectable);
  }

  public getInjectable (injectable: string): any {
      return this.injectables.get(injectable);
  }

  public registerInjector(injector: Injector){
      this.injectors.push(injector);
  }

  public getInjector(injector: string){
      return this.injectors.filter(e => e.target.name ===injector);
  }
}

const injectorStore = new InjectorStore();
export default injectorStore;
