import { BaseError } from "./base-error";

export class BusinessError extends BaseError {
    constructor(message) {
        super(message)
    }
}