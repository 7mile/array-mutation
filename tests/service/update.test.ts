import IdInvalidError from '../../src/exceptions/IdInvalidError';
import IdNotFoundError from '../../src/exceptions/IdNotFoundError';
import handleUpdate from '../../src/service/update';

describe('should update posts', () => {
    let arr: any;
    beforeEach(() => {
        arr = [{ _id: 1, 'value': 'old' }];
    })
    test('should return correct result for addition', () => {
        expect(handleUpdate(arr, { value: 'newValue' }, "posts")).toEqual({ $add: { posts: { value: 'newValue' } } });
        expect(arr.length).toBe(2);
        expect(arr[1].value).toBe('newValue');
    });

    test('should return correct result for updating', () => {
        expect(handleUpdate(arr, { _id: 1, value: 'newValue' }, "posts")).toEqual({ $update: { 'posts.0.value': 'newValue' } });
        expect(arr[0].value).toBe('newValue');
    });

    test('should return correct result for deletion', () => {
        expect(handleUpdate(arr, { _id: 1, _delete: true }, "posts")).toEqual({ $remove: { 'posts.0': true } });
        expect(arr.length).toBe(0);
    });

    test('should throw IdNotFoundError when id not found for deletion', () => {
        const t = () => {
            handleUpdate(arr, { _id: 3, _delete: true }, "posts");
        };
        expect(t).toThrowError(IdNotFoundError);
        expect(t).toThrowError('_id is not found.');
    });

    test('should throw IdNotFoundError when id is undefined for deletion', () => {
        const t = () => {
            handleUpdate(arr, { _id: undefined, _delete: true }, "posts");
        };
        expect(t).toThrowError(IdInvalidError);
        expect(t).toThrowError('_id should not be null or undefined.');
    });

    test('should throw IdNotFoundError when id is null for deletion', () => {
        const t = () => {
            handleUpdate(arr, { _id: null, _delete: true }, "posts");
        };
        expect(t).toThrowError(IdInvalidError);
        expect(t).toThrowError('_id should not be null or undefined.');
    });
})

describe('should update post.mentions', () => {
    let arr: any;
    beforeEach(() => {
        arr = [{ _id: 1, value: 'old', mentions: [{ _id: 2, text: 'apple' }, { _id: 3, text: 'orange' }] }];
    })

    test('should return correct result for addition', () => {
        expect(handleUpdate(arr[0]['mentions'], { text: 'pear' }, "posts.0.mentions")).toEqual({ $add: { 'posts.0.mentions': { text: 'pear' } } });
        expect(arr[0]['mentions'].length).toBe(3);
        expect(arr[0]['mentions'][2].text).toBe('pear');
    });

    test('should return correct result for updating', () => {
        expect(handleUpdate(arr[0]['mentions'], { _id: 2, text: 'pear' }, "posts.0.mentions")).toEqual({ $update: { 'posts.0.mentions.0.text': 'pear' } });
        expect(arr[0]['mentions'].length).toBe(2);
        expect(arr[0]['mentions'][0].text).toBe('pear');
    });

    test('should return correct result for deletion', () => {
        expect(handleUpdate(arr[0]['mentions'], { _id: 3, _delete: true }, "posts.0.mentions")).toEqual({ $remove: { 'posts.0.mentions.1': true } });
        expect(arr[0]['mentions'].length).toBe(1);
    });

    test('should throw IdNotFoundError when id not found for deletion', () => {
        const t = () => {
            handleUpdate(arr[0]['mentions'], { _id: 5, _delete: true }, "posts.0.mentions");
        };
        expect(t).toThrowError(IdNotFoundError);
        expect(t).toThrowError('_id is not found.');
    });

    test('should throw IdNotFoundError when id is undefined for deletion', () => {
        const t = () => {
            handleUpdate(arr[0]['mentions'], { _id: undefined, _delete: true }, "posts.0.mentions");
        };
        expect(t).toThrowError(IdInvalidError);
        expect(t).toThrowError('_id should not be null or undefined.');
    });

    test('should throw IdNotFoundError when id is null for deletion', () => {
        const t = () => {
            handleUpdate(arr[0]['mentions'], { _id: null, _delete: true }, "posts.0.mentions");
        };
        expect(t).toThrowError(IdInvalidError);
        expect(t).toThrowError('_id should not be null or undefined.');
    });
})