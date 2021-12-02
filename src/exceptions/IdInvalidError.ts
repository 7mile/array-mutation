export default class IdInvalidError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, IdInvalidError.prototype);
    }
}
