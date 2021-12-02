import binarySearch from 'binary-search'
import { Searchable } from "../interfaces/searchable";

export default function findIndex(searchable: Searchable[], id: number): number {
    return binarySearch<Searchable, number>(searchable, id, (a: Searchable, b: number) => a._id - b);
}