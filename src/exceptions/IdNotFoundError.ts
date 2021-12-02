export default class IdNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, IdNotFoundError.prototype);
    }
}