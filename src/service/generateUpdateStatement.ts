import Mutation from '../models/mutation';
import Document from '../models/document';
import findIndex from './search';
import update from './update';
import IdNotFoundError from '../exceptions/IdNotFoundError';

export default function generateUpdateStatement(original: Document, mutation: Mutation): Array<object> {
    let result = [];

    for (let key in mutation) {
        let command = mutation[key];

        if (command instanceof Array) {
            if (!(original[key] instanceof Array)) {
                continue;
            }
            const subResults = handleArray(original[key], command, key)
            for (let subResult of subResults) {
                result.push(subResult);
            }
        }
    }

    return result;
}

function handleArray(original: Array<Document>, commands: Array<Mutation>, location: string): Array<object> {
    console.log('handleArray for location: ', location);
    let result = [];
    for (let command of commands) {
        const subResults = handleCommand(original, command, location);
        for (let subResult of subResults) {
            result.push(subResult);
        }
    }
    return result;
}

function handleCommand(original: Array<Document>, command: Mutation, location: string): Array<object> {
    console.log('handleCommand: ', command);

    for (let k in command) {
        if (command[k] instanceof Array) {
            if (!('_id' in command && command._id)) {
                continue;
            }
            let index = findIndex(original, command._id);
            if (index < 0) {
                throw new IdNotFoundError(location + '._id ' + command._id + ' is not found.');
            }
            let document = original[index];
            if (document && k in document && document[k] instanceof Array) {
                return handleArray(document[k], command[k], location + '.' + index + '.' + k);
            }
        }
    }
    return [update(original, command, location)];
}