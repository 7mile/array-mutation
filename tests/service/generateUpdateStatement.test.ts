import generateUpdateStatement from '../../src/service/generateUpdateStatement';
import Document from '../../src/models/document';
import IdNotFoundError from '../../src/exceptions/IdNotFoundError';

describe('should update any sub arraies', () => {
    let document: Document;
    beforeEach(() => {
        document = { _id: 1, value: 'v1', a: [{ _id: 2, name: "a2" }] };
    })
    test('should return correct result for updating subarray a', () => {
        expect(generateUpdateStatement(document, { a: [{ _id: 2, name: 'a2_new' }] })).toEqual([{ $update: { 'a.0.name': 'a2_new' } }]);
    });

    test('should return correct result for addition', () => {
        expect(generateUpdateStatement(document, { a: [{ name: 'new' }] })).toEqual([{ $add: { 'a': { 'name': 'new' } } }]);
    });

    test('should return correct result for updating subarray a.b', () => {
        document = { _id: 1, value: 'v1', a: [{ _id: 2, b: [{ _id: 3, name: "b3" }] }] };
        expect(generateUpdateStatement(document, { a: [{ _id: 2, b: [{ _id: 3, name: 'b3_new' }] }] })).toEqual([{ $update: { 'a.0.b.0.name': 'b3_new' } }]);
    });

    test('should return correct result for deleting subarray a.b', () => {
        document = { _id: 1, value: 'v1', a: [{ _id: 2, b: [{ _id: 3, name: "b3" }] }] };
        expect(generateUpdateStatement(document, { a: [{ _id: 2, b: [{ _id: 3, _delete: true }] }] })).toEqual([{ $remove: { 'a.0.b.0': true } }]);
    });

    test('should throw IdNotFoundError when id not found for deletion', () => {
        const t = () => {
            generateUpdateStatement(document, { a: [{ _id: 3, _delete: true }] });
        };
        expect(t).toThrowError(IdNotFoundError);
        expect(t).toThrowError('_id is not found.');
    });
})
