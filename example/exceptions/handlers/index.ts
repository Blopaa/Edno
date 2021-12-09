import { ErrorHandler } from "../../../src/decorators/ErrorHandler";
import { ValidationExeption } from "../exceptions/ValidationExeption";

class ExceptionHandler {
  @ErrorHandler(ValidationExeption)
  public redoTry ( validationExeption: ValidationExeption){
    return {
      status: validationExeption.status,
      message: validationExeption.message,
    }
  }

}
