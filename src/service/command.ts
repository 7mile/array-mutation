export default function parseCommand(c: object) {
    if (!('_id' in c)) {
        return 'add';
    } else if ('_delete' in c) {
        return 'remove';
    }

    return 'update';
}