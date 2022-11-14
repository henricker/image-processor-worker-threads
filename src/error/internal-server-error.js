import { BaseError } from "./base-error.js";

export class InternalServerError extends BaseError {
    constructor() {
        super('Internal Server Error')
        this.name = 'InternalServerError'
    }
}