import parseCommand from "../../src/service/command";

test('should return add when no _id in command', () => {
    expect(parseCommand({ value: 1 })).toBe('add');
});

test('should return update when _id is in command and no _delete', () => {
    expect(parseCommand({ _id: 1, ivalue: 1 })).toBe('update');
});

test('should return remove when _delete and _id are in command', () => {
    expect(parseCommand({ _id: 1, _delete: 1 })).toBe('remove');
});