const request = require("supertest");

const app = require('../server');

describe('authenticate requests', () => {
    test('call /time without header Authorization without value ‘mysecrettoken’.', async () => {
        const response = await request(app)
            .get("/time")
            .expect(403);
    });
    test('call /time without header Authorization with value ‘mysecrettoken’.', async () => {
        await request(app)
            .get('/time')
            .set('Authorization', 'mysecrettoken')
            .expect(200).then(response => {
                expect(response.text).toContain('The current server time, in epoch seconds, at time of processing the request.')
            })
    })
    test('call invalid api as /abc', async () => {
        await request(app)
            .get('/abc')
            .set('Authorization', 'mysecrettoken')
            .expect(404)
    })
    test('call /time without header Authorization with value ‘mysecrettoken’.', async () => {
        await request(app)
            .get('/metrics')
            .set('Authorization', 'mysecrettoken')
            .expect(200)
            .then(response => {
                expect(response.text).toContain('http_request_duration_seconds')
            })
    });
});