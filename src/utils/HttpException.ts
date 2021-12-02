export class HttpException extends Error {
    constructor(
        private readonly _status: number,
        private readonly _response: string | Record<string, any>
    ) {
        super();
        Object.setPrototypeOf(this, new.target.prototype); // prevents the name of the classes extending it from being Error
        this.buildMessage();
    }

    get status(): number {
        return this._status;
    }

    get response(): string | Record<string, any> {
        return this._response;
    }

    /**
     * builds the Error message
     * @private
     */
    private buildMessage() {
        if (typeof this._response == "string") {
            this.message = this._response;
        } else if (
            typeof this._response == "object" &&
            typeof (this._response as Record<string, any>).message == "string"
        ) {
            this.message = (this._response as Record<string, any>).message;
        } else if (this.constructor) {
            // prettier-ignore
            this.message = this.constructor.name
                .match(/[A-Z][a-z]+|[0-9]+/g)
                ?.join(" ") || "";
        }
    }
}
