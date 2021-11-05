import { ErrorHandlerDef } from "../types/route";

class ErrorHandlerStore {
    private readonly errorHandlers = new Map<string, ErrorHandlerDef>();

    public registerErrorHandler(exceptionClass: ErrorHandlerDef) {
        this.errorHandlers.set(exceptionClass.exceptionHandled, exceptionClass);
    }

    public getErrorHandler(errorHandler: string): ErrorHandlerDef | undefined {
        return this.errorHandlers.get(errorHandler);
    }
}

const errorHandlerStore = new ErrorHandlerStore();
export default errorHandlerStore;
