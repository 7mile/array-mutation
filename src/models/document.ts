import { Searchable } from "src/interfaces/searchable";
import Post from "./post";

export default class Document implements Searchable {
    _id: number;
    name: string;
    posts: Post[];
    constructor(_id: number, name: string, posts: Post[]) {
        this._id = _id;
        this.name = name;
        this.posts = posts;
    }
}
