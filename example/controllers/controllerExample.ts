import { Get } from "../../src/decorators/Methods";
import Controller from "../../src/decorators/Controller";
import { HttpStatus } from "../../src/types/HttpStatus";
import HttpCode from "../../src/decorators/HttpCode";
import { Param } from "../../src/decorators/Parameter";
import { Inject } from "../../src/decorators/Inject";
import { ComponentExample } from "../components/ComponentExample";

@Controller("/greet")
export default class ControllerExample {

    constructor(@Inject(ComponentExample)private componentExample: ComponentExample) {
    }

    @Get("/:name")
    @HttpCode(HttpStatus.OK)
    public greet (@Param("name") name: string): string {
        return this.componentExample.greet(name)
    }

}
