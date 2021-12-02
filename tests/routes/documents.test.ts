import request from 'supertest';
import app from '../../src/server';

describe('API tests', () => {
    jest.fn()

    test('API should return a 200 status', (done) => {
        request(app)
            .post('/api/documents')
            .send({
                "original": {
                    "_id": 1,
                    "name": "document1",
                    "posts": [{ "_id": 2, "value": "too", "mentions": [{ "_id": 1, "text": "apple" }] }]
                },
                "mutation": { "posts": [{ "_id": 2, "mentions": [{ "_id": 1, "text": "pear" }] }] }
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual([
                    { "$update": { "posts.0.mentions.0.text": "pear" } }
                ]);
                done();
            });
    });

    test('API should return a 422 status when no posts in mutation', (done) => {
        request(app)
            .post('/api/documents')
            .send({
                "original": {
                    "_id": 1,
                    "name": "document1",
                    "posts": [{ "_id": 2, "value": "too", "mentions": [] }]
                },
                "mutation": { "request": [{ "_id": 5, "mentions": [{ "_id": 1, "text": "pear" }] }] }
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .then((response) => {
                expect(response.statusCode).toBe(422);
                expect(response.body).toEqual(
                    { "msg": 'Validation err: "mutation.posts" is required', "success": false }
                );
                done();
            });
    });

    test('API should return a 422 status when _id in posts command is null', (done) => {
        request(app)
            .post('/api/documents')
            .send({
                "original": {
                    "_id": 1,
                    "name": "document1",
                    "posts": [{ "_id": 2, "value": "too", "mentions": [] }]
                },
                "mutation": { "posts": [{ "_id": null, "mentions": [{ "_id": 1, "text": "pear" }] }] }
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .then((response) => {
                expect(response.statusCode).toBe(422);
                expect(response.body).toEqual(
                    { "msg": 'Validation err: "mutation.posts[0]._id" must be a number', "success": false }
                );
                done();
            });
    });

    test('API should return a 404 status when _id in posts command is undefined', (done) => {
        request(app)
            .post('/api/documents')
            .send({
                "original": {
                    "_id": 1,
                    "name": "document1",
                    "posts": [{ "_id": 2, "value": "too", "mentions": [] }]
                },
                "mutation": { "posts": [{ "_id": undefined, "mentions": [{ "_id": 1, "text": "pear" }] }] }
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .then((response) => {
                expect(response.statusCode).toBe(404);
                expect(response.body).toEqual(
                    { "msg": '_id is not found', "success": false }
                );
                done();
            });
    });
});