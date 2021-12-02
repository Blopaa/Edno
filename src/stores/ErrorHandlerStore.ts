import { ErrorHandlerDef } from "../types";

class ErrorHandlerStore {
    private readonly errorHandlers = new Map<string, ErrorHandlerDef>();

    /**
     * stores errorHandlers
     * @param {ErrorHandlerDef} exceptionClass
     */
    public registerErrorHandler(exceptionClass: ErrorHandlerDef) {
        this.errorHandlers.set(exceptionClass.exceptionHandled, exceptionClass);
    }

    /**
     * return error handler from received key
     * @param {string} errorHandler - error handler key
     * @return {ErrorHandlerDef | undefined} - found errorHandler or undefined
     */
    public getErrorHandler(errorHandler: string): ErrorHandlerDef | undefined {
        return this.errorHandlers.get(errorHandler);
    }
}

const errorHandlerStore = new ErrorHandlerStore();
export default errorHandlerStore;
