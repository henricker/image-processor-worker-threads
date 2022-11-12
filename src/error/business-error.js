import { BaseError } from "./base-error.js";

export class BusinessError extends BaseError {
    constructor(message) {
        super(message)
    }
}