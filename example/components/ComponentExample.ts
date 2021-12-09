import { Component } from "../../src/decorators/Component";
import { ValidationExeption } from "../exceptions/exceptions/ValidationExeption";

@Component()
export class ComponentExample {
  public greet (name: string) {
    if(!name){
      throw new ValidationExeption("name is missing")
    }
    return `hi ${name}`;
  }
}
