import Mention from "./mention";

export default class Post {
    _id: number;
    value: string;
    mentions?: Mention[];
    constructor(_id: number, value: string, mentions: Mention[]) {
        this._id = _id;
        this.value = value;
        this.mentions = mentions;
    }
}