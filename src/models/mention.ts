export default class Mention {
    _id: number
    text: string
    constructor(_id: number, text: string) {
        this._id = _id;
        this.text = text;
    }
}