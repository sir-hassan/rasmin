import request from 'supertest'
import {apiRoot, conn, redisClient, server} from '../index'

let sid

beforeAll(async () => {
    const res = await request(server)
        .post(apiRoot + '/auth')
        .send({
            name: 'yassir',
            email: 'yassir@mikrogo.com',
        })
    sid = res.body.sid
})

describe('Basic Endpoints', () => {
    it('should have post on /users', async () => {
        const res = await request(server)
            .post(apiRoot + '/users')
            .set('X-Auth-Token', sid)
            .send({
                name: 'alex',
                email: 'alex@mikrogo.com',
            })
        expect(res.statusCode).toEqual(200)
    })
    it('should have 404', async () => {
        const res = await request(server)
            .get(apiRoot + '/someResource')
            .set('X-Auth-Token', sid)
            .send()
        expect(res.statusCode).toEqual(404)
    })
})

afterAll((done) => {
    server.close(function(err) {
        if (err) console.log(err)
        conn.end(function(err) {
            if (err) console.log(err)
            redisClient.disconnect()
            done()
        })
    })
})
