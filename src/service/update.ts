import { Searchable } from "../interfaces/searchable";
import findIndex from "./search";
import IdNotFoundError from "../exceptions/IdNotFoundError";
import IdInvalidError from "../exceptions/IdInvalidError";
import parseCommand from "./command";

export default function update<T extends Searchable>(arr: T[], command: object, location: string) {
    const op = parseCommand(command)

    switch (op) {
        case 'add':
            const newItem: { [k: string]: any } = Object.assign({}, command);

            if (arr.length == 0) {
                newItem._id = 1
            } else {
                // increase id by 1
                newItem._id = arr[arr.length - 1]._id + 1;
            }

            arr.push(newItem as T);

            return { $add: { [location]: command } };

        case 'remove':
            const idIndex = getIdIndex(arr, command);

            arr.splice(idIndex, 1);

            const keyToRemove = location + '.' + idIndex;

            return { $remove: { [keyToRemove]: true } }

        case 'update':
            const index = getIdIndex(arr, command);

            const updatedValues: { [k: string]: any } = {}

            const updatedItem = command as T
            
            for (let key in updatedItem) {
                if (key === '_id') {
                    continue;
                }
                const keyToUpdate = location + '.' + index + '.' + key;
                updatedValues[keyToUpdate] = updatedItem[key];
            }

            arr[index] = updatedItem;

            return { $update: updatedValues }
    }
}

function getIdIndex<T extends Searchable>(arr: T[], command: object) {
    if (!('_id' in command) || (command as Searchable)._id == null) {
        throw new IdInvalidError('_id should not be null or undefined.');
    }

    const id = (command as Searchable)._id;

    const idIndex = findIndex(arr, id!);

    if (idIndex < 0) {
        throw new IdNotFoundError('_id is not found.');
    }

    return idIndex;
}