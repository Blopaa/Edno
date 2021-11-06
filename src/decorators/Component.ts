import injectorStore from "../stores/InjectorStore";

export function Component (): ClassDecorator{
  return ((component: new () => unknown) => {
      injectorStore.registerInjectable({ controller: component.name, target: component });
    }) as ClassDecorator
}

