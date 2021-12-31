import { Searchable } from "../interfaces/searchable";
import SubArray from "./subArray";

type Document = Searchable & SubArray<Document>;

export default Document;
